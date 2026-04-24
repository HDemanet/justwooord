class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :lessons, dependent: :destroy
  has_many :words, dependent: :destroy
  has_many :tags, dependent: :destroy
  has_many :review_cards, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  # RGPD - soft delete
  def soft_delete
    update(deleted_at: Time.current)
  end

  def active_for_authentication?
    super && deleted_at.nil?
  end
end
