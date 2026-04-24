module Api
  module V1
    class ReviewCardsController < BaseController
      def index
        cards = current_user.review_cards.includes(:word)
        render json: cards
      end

      def due
        limit = (params[:limit] || 20).to_i
        cards = current_user.review_cards.includes(:word)

        if params[:lesson_id].present?
          cards = cards.where(words: { lesson_id: params[:lesson_id] })
                      .joins(:word)
        end

        cards = cards.where('next_review_at <= ?', Time.current)
                    .order(:next_review_at)
                    .limit(limit)
                    .sort_by { rand }

        render json: cards.as_json(include: :word)
      end

      def update
        card = current_user.review_cards.find(params[:id])
        card.review!(params[:quality].to_i)
        render json: { ok: true }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Introuvable.' }, status: :not_found
      end
    end
  end
end
