Rails.application.routes.draw do
# Home Page
  get "", to: 'home#index'
  #get 'home/index'
  root 'home#index'
  
# Under Construction
  get "UnderConstruction", to: 'home#construction'
  #get 'home/construction'
  
# Beta 
  get "Beta", to:'home#beta'
  #get 'home/beta'
  
end
