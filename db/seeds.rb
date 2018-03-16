# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


d = ""
c = Community.create!(name: "Dienstleistungen" , description: d, typus: "Branche", icon: "assets/images/icons/Dienstleistung.svg")
Community.create!(name: "Handel", description: d, typus: "Branche", icon: "assets/images/icons/Handel.svg")
Community.create!(name: "E-Commerce", description: d, typus: "Branche", icon: "assets/images/icons/E-Commerce.svg")
Community.create!(name: "Freizeit", description: d, typus: "Branche", icon: "assets/images/icons/Freizeit.svg")
Community.create!(name: "Internet", description: d, typus: "Branche", icon: "assets/images/icons/Internet.svg")
Community.create!(name: "Energie \& Umwelt", description: d, typus: "Branche", icon: "assets/images/icons/Energie und Umwelt.svg")
Community.create!(name: "Food \& Drink", description: d, typus: "Branche", icon: "assets/images/icons/Food and Drink.svg")
#Community.create!(name: "Metall \& Elektronik", description: d, typus: "Branche", icon: "assets/images/icons/MetallElektronik.svg")
Community.create!(name: "Tourismus \& Gastronomie", description: d, typus: "Branche", icon: "assets/images/icons/Tourismus und Gastronomie.svg")
Community.create!(name: "Life Science", description: d, typus: "Branche", icon: "assets/images/icons/Life Science.svg")
Community.create!(name: "Mobilität, Verkehr \& Logistik", description: d, typus: "Branche", icon: "assets/images/icons/Mobilität, Logistik, Verkehr.svg")
Community.create!(name: "Design \& Kreativwirtschaft", description: d, typus: "Branche", icon: "assets/images/icons/Design und Kreativwirtschaft.svg")
Community.create!(name: "IT \& Softwareentwicklung", description: d, typus: "Branche", icon: "assets/images/icons/IT Softwareentwicklung.svg")
Community.create!(name: "Sonstiges", description: d, typus: "Branche", icon: "assets/images/icons/Sonstiges.svg")

Community.create!(name: "3d-Printing" , description: d, typus: "Thema", icon: "assets/images/icons/3d-printing.svg")
Community.create!(name: "AI", description: d, typus: "Thema", icon: "assets/images/icons/AI.svg")
Community.create!(name: "App Entwicklung", description: d, typus: "Thema", icon: "assets/images/icons/App Entwicklung.svg")
Community.create!(name: "Beratungsunternehmen", description: d, typus: "Thema", icon: "assets/images/icons/Beratungsunternehmen.svg")
Community.create!(name: "Bildung", description: d, typus: "Thema", icon: "assets/images/icons/Bildung.svg")
Community.create!(name: "Biotechnologie", description: d, typus: "Thema", icon: "assets/images/icons/Biotechnologie.svg")
Community.create!(name: "Cloud \& Big Data", description: d, typus: "Thema", icon: "assets/images/icons/Cloud Big Data.svg")
Community.create!(name: "Cyber Security", description: d, typus: "Thema", icon: "assets/images/icons/Cyber Security.svg")
Community.create!(name: "DIY", description: d, typus: "Thema", icon: "assets/images/icons/DIY Logo.svg")
Community.create!(name: "E-Government", description: d, typus: "Thema", icon: "assets/images/icons/E-Government.svg")
Community.create!(name: "e-health Smart Apps", description: d, typus: "Thema", icon: "assets/images/icons/e-health Smart Apps.svg")
Community.create!(name: "e-Mobilität", description: d, typus: "Thema", icon: "assets/images/icons/e-Mobilität.svg")
Community.create!(name: "Fahrzeug & Straßenverkehr", description: d, typus: "Thema", icon: "assets/images/icons/Fahrzeug & Straßenverkehr.svg")
Community.create!(name: "Feinmechanik & Optik", description: d, typus: "Thema", icon: "assets/images/icons/Feinmechanik & Optik.svg")
Community.create!(name: "Games", description: d, typus: "Thema", icon: "assets/images/icons/Games.svg")
Community.create!(name: "Groß und Einzelhandel", description: d, typus: "Thema", icon: "assets/images/icons/Groß und Einzelhandel.svg")
Community.create!(name: "Haushaltsgeräte", description: d, typus: "Thema", icon: "assets/images/icons/Haushaltsgeräte.svg")
Community.create!(name: "Hobby", description: d, typus: "Thema", icon: "assets/images/icons/Hobby.svg")
Community.create!(name: "Internet", description: d, typus: "Thema", icon: "assets/images/icons/Internet.svg")
Community.create!(name: "IoT", description: d, typus: "Thema", icon: "assets/images/icons/IoT Icon.svg")
Community.create!(name: "Konsumgüter", description: d, typus: "Thema", icon: "assets/images/icons/Konsumgüter.svg")
Community.create!(name: "Kunst und Kultur", description: d, typus: "Thema", icon: "assets/images/icons/Kunst und Kultur.svg")
Community.create!(name: "Maschinen und Gerätehersteller", description: d, typus: "Thema", icon: "assets/images/icons/Maschinen und Gerätehersteller.svg")
Community.create!(name: "Medizintechnik", description: d, typus: "Thema", icon: "assets/images/icons/Medizintechnik.svg")
Community.create!(name: "Online Marketplace", description: d, typus: "Thema", icon: "assets/images/icons/Online Marketplace.svg")
Community.create!(name: "Online Service Portal", description: d, typus: "Thema", icon: "assets/images/icons/Online Service Portal.svg")
Community.create!(name: "Robots", description: d, typus: "Thema", icon: "assets/images/icons/Robots.svg")
Community.create!(name: "Smart Home", description: d, typus: "Thema", icon: "assets/images/icons/Smart Home.svg")
Community.create!(name: "Sport und Wellness", description: d, typus: "Thema", icon: "assets/images/icons/Sport und Wellness.svg")
Community.create!(name: "Suchmaschinen und SEO", description: d, typus: "Thema", icon: "assets/images/icons/Suchmaschinen und SEO.svg")
Community.create!(name: "Umwelt und Energietechnologie", description: d, typus: "Thema", icon: "assets/images/icons/Umwelt und Energietechnologie.svg")
Community.create!(name: "VR AR", description: d, typus: "Thema", icon: "assets/images/icons/VR AR.svg")
Community.create!(name: "Wearables", description: d, typus: "Thema", icon: "assets/images/icons/Wearables.svg")
Community.create!(name: "Web-Entwicklung", description: d, typus: "Thema", icon: "assets/images/icons/WebEntwicklung.svg")
Community.create!(name: "Werbung und Marketing", description: d, typus: "Thema", icon: "assets/images/icons/Werbung und Marketing.svg")

admin = User.new
admin.email = 'braunt2@protonmail.com'
admin.username = 'admin2'
admin.password = 'password'
admin.password_confirmation = 'password'
admin.role = 'admin'
admin.save!

project = Project.new
project.name = 'DemoProjekt'
project.user = admin
project.goal = 'Serve as Filler for the Page'
project.problem = 'It\'s hard to see what the page looks like without filler.'
project.solution = 'Create a premade Projet to fill this'
project.coop = true
project.likes = 3
project.status = 'Published'
project.save!

project.communities << c

cm = Comment.new
cm.user_id = 1
cm.parent_id = 1
cm.parent_type = 'Project'
cm.save!
