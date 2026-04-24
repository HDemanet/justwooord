module Api
  module V1
    class ImportsController < BaseController
      def create
        unless params[:file].present?
          render json: { error: 'Aucun fichier fourni.' }, status: :bad_request and return
        end

        file = params[:file]
        tmp_path = Rails.root.join('tmp', file.original_filename)
        File.binwrite(tmp_path, file.read)

        result = ExcelImportService.new(current_user, tmp_path.to_s).call

        File.delete(tmp_path) if File.exist?(tmp_path)

        render json: {
          message: "Import terminé.",
          imported: result[:imported],
          skipped: result[:skipped],
          errors: result[:errors].first(5)
        }
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end
    end
  end
end
