Rails.application.routes.draw do
# Home Page
  get "", to: 'home#index'
  #get 'home/index'
  root 'home#index'

  get "UnderConstruction", to: 'home#construction'
  #get 'home/construction'
end
