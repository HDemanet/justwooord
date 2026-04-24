class CreateLessons < ActiveRecord::Migration[7.1]
  def change
    create_table :lessons do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.date :date
      t.string :topic
      t.string :teacher

      t.timestamps
    end
  end
end
