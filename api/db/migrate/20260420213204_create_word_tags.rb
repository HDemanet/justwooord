class CreateWordTags < ActiveRecord::Migration[7.1]
  def change
    create_table :word_tags do |t|
      t.references :word, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true
    end
  end
end
