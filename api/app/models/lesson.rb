class Lesson < ApplicationRecord
  belongs_to :user
  has_many :words, dependent: :nullify

  validates :title, presence: true
  validates :date, presence: true

  default_scope { order(date: :desc) }
end
