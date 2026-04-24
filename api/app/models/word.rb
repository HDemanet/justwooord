class Word < ApplicationRecord
  belongs_to :user
  belongs_to :lesson, optional: true
  has_many :word_tags, dependent: :destroy
  has_many :tags, through: :word_tags
  has_one :review_card, dependent: :destroy

  enum article: { de: 0, het: 1 }
  enum grammatical_category: {
    nom: 0,
    verbe: 1,
    adjectif: 2,
    adverbe: 3,
    expression: 4,
    regle_grammaire: 5
  }
  enum thematic_category: {
    noms_generaux: 0,
    verbes_generaux: 1,
    adj_adv_expr: 2,
    temps_freq: 3,
    justice_personnes: 4,
    justice_procedure: 5,
    grammaire: 6,
    au_fil_des_cours: 7,
    general: 8
  }

  validates :dutch, presence: true
  validates :french, presence: true
  validates :grammatical_category, presence: true
  validates :thematic_category, presence: true

  after_create :create_review_card

  private

  def create_review_card
    ReviewCard.create!(
      user: user,
      word: self,
      next_review_at: Time.current
    )
  end
end
