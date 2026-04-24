class CreateWords < ActiveRecord::Migration[7.1]
  def change
    create_table :words do |t|
      t.references :user, null: false, foreign_key: true
      t.references :lesson, null: true, foreign_key: true
      t.string :dutch
      t.integer :article
      t.integer :grammatical_category
      t.string :french
      t.integer :thematic_category
      t.text :example_nl
      t.text :example_fr
      t.boolean :example_ai_generated, null: false, default: false
      t.boolean :example_validated, null: false, default: false
      t.string :conjugated_form
      t.boolean :separable

      t.timestamps
    end
  end
end
