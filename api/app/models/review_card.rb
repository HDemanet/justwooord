class ReviewCard < ApplicationRecord
  belongs_to :user
  belongs_to :word

  SM2_MIN_EASE = 1.3

  def self.due_for(user)
    where(user: user)
      .where('next_review_at <= ?', Time.current)
      .includes(:word)
      .order(:next_review_at)
  end

  def review!(quality)
    # quality : 1 (difficile), 2 (correct), 3 (facile)
    if quality >= 2
      new_interval = calculate_interval
      new_ease = [ease_factor + (0.1 - (3 - quality) * 0.08), SM2_MIN_EASE].max
      update!(
        repetitions: repetitions + 1,
        interval: new_interval,
        ease_factor: new_ease,
        last_reviewed_at: Time.current,
        next_review_at: Time.current + new_interval.days
      )
    else
      update!(
        repetitions: 0,
        interval: 1,
        last_reviewed_at: Time.current,
        next_review_at: Time.current + 1.day
      )
    end
  end

  private

  def calculate_interval
    case repetitions
    when 0 then 1
    when 1 then 6
    else (interval * ease_factor).round
    end
  end
end
