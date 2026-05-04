module Api
  module V1
    class ExportsController < ApplicationController
      before_action :authenticate_user!

      def show
        user = current_user
        words = user.words.includes(:lesson).map do |w|
          {
            id: w.id,
            dutch: w.dutch,
            french: w.french,
            grammatical_category: w.grammatical_category,
            conjugated_form: w.conjugated_form,
            example_nl: w.example_nl,
            example_fr: w.example_fr,
            lesson: w.lesson&.title,
            created_at: w.created_at,
          }
        end

        lessons = user.lessons.map do |l|
          {
            id: l.id,
            title: l.title,
            date: l.date,
            teacher: l.teacher,
            topic: l.topic,
            created_at: l.created_at,
          }
        end

        review_cards = user.review_cards.map do |rc|
          {
            word_id: rc.word_id,
            ease_factor: rc.ease_factor,
            repetitions: rc.repetitions,
            interval: rc.interval,
            next_review_at: rc.next_review_at,
            last_reviewed_at: rc.last_reviewed_at,
          }
        end

        data = {
          exported_at: Time.current,
          user: {
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
          words: words,
          lessons: lessons,
          review_cards: review_cards,
        }

        send_data data.to_json,
          filename: "justwooord_export_#{Date.today}.json",
          type: "application/json",
          disposition: "attachment"
      end
    end
  end
end
