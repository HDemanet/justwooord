class Tag < ApplicationRecord
  belongs_to :user
  has_many :word_tags, dependent: :destroy
  has_many :words, through: :word_tags

  validates :name, presence: true, uniqueness: { scope: :user_id }
end
