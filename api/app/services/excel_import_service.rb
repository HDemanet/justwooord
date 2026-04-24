class ExcelImportService
  SHEET_CATEGORIES = {
    '1 - Noms généraux'      => 'noms_generaux',
    'Noms généraux'          => 'noms_generaux',
    '2 - Verbes généraux'    => 'verbes_generaux',
    'Verbes généraux'        => 'verbes_generaux',
    '3 - Adj, adv, expr.'    => 'adj_adv_expr',
    'Adj, adv, expr.'        => 'adj_adv_expr',
    '4 - Temps et freq.'     => 'temps_freq',
    'Temps et freq.'         => 'temps_freq',
    '5 - Justice personnes'  => 'justice_personnes',
    'Justice personnes'      => 'justice_personnes',
    '6 - Justice procédure'  => 'justice_procedure',
    'Justice procédure'      => 'justice_procedure',
    '7 - Au fil du cours'   => 'au_fil_des_cours',
    'Au fil du cours'       => 'au_fil_des_cours',
  }.freeze

  GRAM_CATEGORIES = {
    'zelfst. naamw.'         => 'nom',
    'zelfstandig naamwoord'  => 'nom',
    'werkwoord'              => 'verbe',
    'werkwoord (scheidbaar)' => 'verbe',
    'scheidbaar'             => 'verbe',
    'bijvoeglijk naamwoord'  => 'adjectif',
    'bijv. naamw.'           => 'adjectif',
    'bijwoord'               => 'adverbe',
    'uitdrukking'            => 'expression',
    'voegwoord'              => 'expression',
    'grammaicaregel'         => 'regle_grammaire',
  }.freeze

  def initialize(user, file_path)
    @user = user
    @file_path = file_path
  end

  def call
    workbook = Roo::Spreadsheet.open(@file_path)
    results = { imported: 0, skipped: 0, errors: [] }

    workbook.sheets.each do |sheet_name|
      thematic = SHEET_CATEGORIES[sheet_name]
      next unless thematic

      sheet = workbook.sheet(sheet_name)
      rows = sheet.parse(headers: true)

      rows.each_with_index do |row, i|
        next if i == 0
        next if row.values.all?(&:nil?)

        dutch_raw = (row['Nederlands'] || row['Infinitif'] || row[row.keys[0]])&.to_s&.strip
        french    = (row['Français'] || row[row.keys.find { |k| k&.include?('ran') }])&.to_s&.strip

        next if dutch_raw.blank? || french.blank?

        # Extraire l'article du champ dutch si présent
        article = nil
        dutch = dutch_raw
        if dutch_raw.match?(/^(de|het)\s+/i)
          article = dutch_raw.match(/^(de|het)\s+/i)[1].downcase
          dutch   = dutch_raw.sub(/^(de|het)\s+/i, '').strip
        end

        # Gérer les articles multiples ex. "de/het"
        article_raw = row['de/het']&.to_s&.strip&.downcase
        if article.nil? && %w[de het].include?(article_raw)
          article = article_raw
        end

        next if @user.words.exists?(dutch: dutch)

        gram_raw = row['Catégorie gramm.']&.to_s&.strip&.downcase
        gram = GRAM_CATEGORIES.find { |k, _| gram_raw&.include?(k) }&.last || 'nom'

        word = @user.words.build(
          dutch: dutch,
          french: french,
          article: article,
          grammatical_category: gram,
          thematic_category: thematic,
          example_nl: row['Exemples / Notes']&.to_s&.strip,
          conjugated_form: row['Forme conjuguée (ik)']&.to_s&.strip,
        )

        if word.save
          results[:imported] += 1
        else
          results[:errors] << "#{dutch}: #{word.errors.full_messages.join(', ')}"
          results[:skipped] += 1
        end
      rescue => e
        results[:errors] << "Ligne #{i}: #{e.message}"
        results[:skipped] += 1
      end
    end

    results
  end
end
