module Api
  module V1
    class WordsController < BaseController
      before_action :set_word, only: [:show, :update, :destroy]

      def index
        words = current_user.words.includes(:lesson, :tags)
        words = words.where(thematic_category: params[:category]) if params[:category].present?
        words = words.where(lesson_id: params[:lesson_id]) if params[:lesson_id].present?
        render json: words.as_json(include: { lesson: { only: [:id, :title, :date] } })
      end

      def show
        render json: @word.as_json(include: { tags: {}, lesson: { only: [:id, :title, :date] } })
      end

      def create
        word = current_user.words.build(word_params)
        if word.save
          render json: word, status: :created
        else
          render json: { errors: word.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @word.update(word_params)
          render json: @word
        else
          render json: { errors: @word.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @word.destroy
        head :no_content
      end

      private

      def set_word
        @word = current_user.words.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Mot introuvable.' }, status: :not_found
      end

      def word_params
        params.require(:word).permit(
          :dutch, :article, :grammatical_category, :french,
          :thematic_category, :example_nl, :example_fr,
          :example_ai_generated, :example_validated,
          :conjugated_form, :separable, :lesson_id
        )
      end
    end
  end
end
