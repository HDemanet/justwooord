# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_04_23_175444) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti", unique: true
  end

  create_table "lessons", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title"
    t.date "date"
    t.string "topic"
    t.string "teacher"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_lessons_on_user_id"
  end

  create_table "review_cards", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "word_id", null: false
    t.float "ease_factor", default: 2.5, null: false
    t.integer "interval", default: 1, null: false
    t.integer "repetitions", default: 0, null: false
    t.datetime "next_review_at"
    t.datetime "last_reviewed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_review_cards_on_user_id"
    t.index ["word_id"], name: "index_review_cards_on_word_id"
  end

  create_table "tags", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "name"
    t.integer "daily_goal_minutes"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "word_tags", force: :cascade do |t|
    t.bigint "word_id", null: false
    t.bigint "tag_id", null: false
    t.index ["tag_id"], name: "index_word_tags_on_tag_id"
    t.index ["word_id"], name: "index_word_tags_on_word_id"
  end

  create_table "words", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "lesson_id"
    t.string "dutch"
    t.integer "article"
    t.integer "grammatical_category"
    t.string "french"
    t.integer "thematic_category"
    t.text "example_nl"
    t.text "example_fr"
    t.boolean "example_ai_generated", default: false, null: false
    t.boolean "example_validated", default: false, null: false
    t.string "conjugated_form"
    t.boolean "separable"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lesson_id"], name: "index_words_on_lesson_id"
    t.index ["user_id"], name: "index_words_on_user_id"
  end

  add_foreign_key "lessons", "users"
  add_foreign_key "review_cards", "users"
  add_foreign_key "review_cards", "words"
  add_foreign_key "tags", "users"
  add_foreign_key "word_tags", "tags"
  add_foreign_key "word_tags", "words"
  add_foreign_key "words", "lessons"
  add_foreign_key "words", "users"
end
