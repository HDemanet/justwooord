module Api
  module V1
    class LessonsController < BaseController
      before_action :set_lesson, only: %i[show update destroy]

      def index
        lessons = current_user.lessons
        render json: lessons
      end

      def show
        lesson = current_user.lessons.find(params[:id])
        render json: lesson
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Leçon introuvable.' }, status: :not_found
      end

      def create
        lesson = current_user.lessons.build(lesson_params)
        if lesson.save
          render json: lesson, status: :created
        else
          render json: { errors: lesson.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @lesson.update(lesson_params)
          render json: @lesson
        else
          render json: { errors: @lesson.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @lesson.destroy
        head :no_content
      end

      private

      def set_lesson
        @lesson = current_user.lessons.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Leçon introuvable.' }, status: :not_found
      end

      def lesson_params
        params.require(:lesson).permit(:title, :date, :topic, :teacher)
      end
    end
  end
end
