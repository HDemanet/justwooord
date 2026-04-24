class CreateReviewCards < ActiveRecord::Migration[7.1]
  def change
    create_table :review_cards do |t|
      t.references :user, null: false, foreign_key: true
      t.references :word, null: false, foreign_key: true
      t.float :ease_factor, null: false, default: 2.5
      t.integer :interval, null: false, default: 1
      t.integer :repetitions, null: false, default: 0
      t.datetime :next_review_at
      t.datetime :last_reviewed_at

      t.timestamps
    end
  end
end
