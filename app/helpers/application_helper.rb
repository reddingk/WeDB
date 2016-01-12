module ApplicationHelper
    def cp(path)
		"current-page" if current_page?(path)
	end
end
