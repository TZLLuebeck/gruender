# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


d = "Bietest du einen neuen Service oder eine innovative Dienstleistung an? Hier kannst du sie präsentieren!"
c = Community.create!(name: "Dienstleistungen\n " , description: d, typus: "Branche", icon: "assets/images/icons/Dienstleistung.svg")
d = "Neue Produkte, neue Märkte, neue Möglichkeiten. Und Dein Projekt mittendrin!"
Community.create!(name: "Handel\n ", description: d, typus: "Branche", icon: "assets/images/icons/Handel.svg")
d = "Werben, kaufen, verkaufen… alles bequem von zu Hause aus. Zeig uns Deine Ideen!"
Community.create!(name: "E-Commerce\n ", description: d, typus: "Branche", icon: "assets/images/icons/E-Commerce.svg")
d = "Wie lässt sich unsere Freizeit aktiv gestalten und was sind die neuesten Trends? "
Community.create!(name: "Freizeit\n ", description: d, typus: "Branche", icon: "assets/images/icons/Freizeit.svg")
d = "Das Internet ist nur ein Hype… oder etwa nicht?"
Community.create!(name: "Internet\n ", description: d, typus: "Branche", icon: "assets/images/icons/Internet.svg")
d = "Die Natur schützen, Ressourcen sparen. Hier finden sich Ideen für mehr Nachhaltigkeit. "
Community.create!(name: "Energie \& Umwelt\n ", description: d, typus: "Branche", icon: "assets/images/icons/Energie und Umwelt.svg")
d = "Kann man das essen oder trinken?  Leckere Projektideen und Innovationen mögen alle."
Community.create!(name: "Food \& Drink\n ", description: d, typus: "Branche", icon: "assets/images/icons/Food and Drink.svg")
d = "Neue Projekte rund ums Thema Reisen, Gastgewerbe. Bunte und sonnige Projekte, bitte hier entlang."
Community.create!(name: "Tourismus \& Gastronomie", description: d, typus: "Branche", icon: "assets/images/icons/Tourismus und Gastronomie.svg")
d = "Alles zum Thema Gesundheit, Fitness, Medizin und Medizintechnik."
Community.create!(name: "Life Science\n ", description: d, typus: "Branche", icon: "assets/images/icons/Life Science.svg")
d = "Was und wer, wann und wohin? Wie werden sich Transportwege in Zukunft ändern?"
Community.create!(name: "Mobilität, Verkehr \& Logistik", description: d, typus: "Branche", icon: "assets/images/icons/Mobilität, Logistik, Verkehr.svg")
d = "Mit Kreativität neue Produkte, künstlerische und soziale Innovationen erschaffen!"
Community.create!(name: "Design \& Kreativwirtschaft", description: d, typus: "Branche", icon: "assets/images/icons/Design und Kreativwirtschaft.svg")
d = "Digitale Dienste, Smart Services und ganz viele Nullen und Einsen… "
Community.create!(name: "IT \& Softwareentwicklung", description: d, typus: "Branche", icon: "assets/images/icons/IT Softwareentwicklung.svg")
d = "Immobilien  – Entdecke neue Lösungen im Bereich Architektur, Bau 4.0 und im Facility Bereich. Alles unter einem Dach."
Community.create!(name: "Immobilien", description: d, typus: "Branche", icon:"assets/images/icons/immobilien.svg")
d = "Dein Projekt lässt sich nicht in Schubladen stecken? Dann präsentiere es hier!"
Community.create!(name: "Sonstiges\n ", description: d, typus: "Branche", icon: "assets/images/icons/Sonstiges.svg")

d = "Drucken in Drei Dimensionen – We love it!"
Community.create!(name: "3d-Printing" , description: d, typus: "Thema", icon: "assets/images/icons/3d-printing.svg")
d = "Vom Schachcomputer zur Super-Intelligenz! Just beat it!"
Community.create!(name: "AI", description: d, typus: "Thema", icon: "assets/images/icons/AI.svg")
d = "Dafür gibt’s eine App. Oder etwa doch nicht?"
Community.create!(name: "App Entwicklung", description: d, typus: "Thema", icon: "assets/images/icons/App Entwicklung.svg")
d = "Hast Du einen Rat für uns? An wen kann man sich wenden? Wir sind gespannt."
Community.create!(name: "Beratung Consulting", description: d, typus: "Thema", icon: "assets/images/icons/Beratungsunternehmen.svg")
d = "E-Learning, Online-Courses oder doch das klassische Lehrbuch? Was kann man wie zukünftig lernen?"
Community.create!(name: "Bildung", description: d, typus: "Thema", icon: "assets/images/icons/Bildung.svg")
d = "Enzyme und Zellen in technischen Anwendungen, wie Herstellung und Diagnostik."
Community.create!(name: "Biotechnologie", description: d, typus: "Thema", icon: "assets/images/icons/Biotechnologie.svg")
d = "Public Cloud, Private Cloud, Hybrid Cloud… Wie sehen die Datenwolken für dich aus?"
Community.create!(name: "Cloud \& Big Data", description: d, typus: "Thema", icon: "assets/images/icons/Cloud Big Data.svg")
d = "Wie können Daten und Systeme geschützt werden?"
Community.create!(name: "Cyber Security", description: d, typus: "Thema", icon: "assets/images/icons/Cyber Security.svg")
d = "Selbstgemacht ist immer noch am schönsten!"
Community.create!(name: "DIY", description: d, typus: "Thema", icon: "assets/images/icons/DIY Logo.svg")
d = "Online-Dokumente, digitale Behördengänge, in diesem Bereich gibt es viel zu tun. Any Ideas?"
Community.create!(name: "E-Government", description: d, typus: "Thema", icon: "assets/images/icons/E-Government.svg")
d = "Digitale Partner für die Gesundheit."
Community.create!(name: "e-health Smart Apps", description: d, typus: "Thema", icon: "assets/images/icons/e-health Smart Apps.svg")
d = "Du brauchst Luftveränderung? Emissionsfrei durch die Stadt."
Community.create!(name: "e-Mobilität", description: d, typus: "Thema", icon: "assets/images/icons/e-Mobilität.svg")
d = "Neue Konzepte für den Straßenverkehr von morgen."
Community.create!(name: "Fahrzeug \& Straßenverkehr", description: d, typus: "Thema", icon: "assets/images/icons/Fahrzeug & Straßenverkehr.svg")
d = "Da muss man schon genauer hinschauen."
Community.create!(name: "Feinmechanik \& Optik", description: d, typus: "Thema", icon: "assets/images/icons/Feinmechanik & Optik.svg")
d = "Spiel, Spaß und Spannung bei der Spieleentwicklung. Du hast ein Projekt? "
Community.create!(name: "Games", description: d, typus: "Thema", icon: "assets/images/icons/Games.svg")
d = "Kaufen und Verkaufen in allen Maßstäben. Wir sind gespannt!"
Community.create!(name: "Groß und Einzelhandel", description: d, typus: "Thema", icon: "assets/images/icons/Groß und Einzelhandel.svg")
d = "Der Staubsauger soll mit der Kaffeemaschine kommunizieren können? Wieso nicht?"
Community.create!(name: "Haushaltsgeräte", description: d, typus: "Thema", icon: "assets/images/icons/Haushaltsgeräte.svg")
d = "Begeistere andere von Deinem Hobby! Denn ohne Hobby geht es nicht! "
Community.create!(name: "Hobby", description: d, typus: "Thema", icon: "assets/images/icons/Hobby.svg")
d = "Was es da nicht alles gibt! Really?"
Community.create!(name: "Internet", description: d, typus: "Thema", icon: "assets/images/icons/Internet.svg")
d = "Was ist denn so dein Ding?"
Community.create!(name: "IoT", description: d, typus: "Thema", icon: "assets/images/icons/IoT Icon.svg")
d = "Dein Produkt wollen alle haben? Zeig‘ es uns!"
Community.create!(name: "Konsumgüter", description: d, typus: "Thema", icon: "assets/images/icons/Konsumgüter.svg")
d = "Projekte zu Musik, Kunst, Gesellschaft und Soziales. Yes, let´s care!"
Community.create!(name: "Kunst und Kultur", description: d, typus: "Thema", icon: "assets/images/icons/Kunst und Kultur.svg")
d = "Innovative Geräte und Industrie 4.0 – Kleine Ideen verändern heute die Welt."
Community.create!(name: "Maschinen und Gerätehersteller", description: d, typus: "Thema", icon: "assets/images/icons/Maschinen und Gerätehersteller.svg")
d = "Interoperable Geräte, Assistenzsysteme, neue Usability-Konzepte uvm."
Community.create!(name: "Medizintechnik", description: d, typus: "Thema", icon: "assets/images/icons/Medizintechnik.svg")
d = "Dein Marktstand rum um die Uhr, die ganze Woche und das ganze Weltweit."
Community.create!(name: "Online Marketplace", description: d, typus: "Thema", icon: "assets/images/icons/Online Marketplace.svg")
d = "Dienstleistungen digital präsentieren und Menschen zusammenbringen – it is a challange!"
Community.create!(name: "Online Service Portal", description: d, typus: "Thema", icon: "assets/images/icons/Online Service Portal.svg")
d = "Mensch vs. Maschine oder Kollege Roboter? Was hast Du vor? "
Community.create!(name: "Robots", description: d, typus: "Thema", icon: "assets/images/icons/Robots.svg")
d = "Home, smart Home. Anwendungen für Zuhause."
Community.create!(name: "Smart Home", description: d, typus: "Thema", icon: "assets/images/icons/Smart Home.svg")
d = "Angebote und Projekte rund um die Themen Sport, Fitness und Wellness."
Community.create!(name: "Sport und Wellness", description: d, typus: "Thema", icon: "assets/images/icons/Sport und Wellness.svg")
d = "Vom Finden und gefunden werden."
Community.create!(name: "Suchmaschinen und SEO", description: d, typus: "Thema", icon: "assets/images/icons/Suchmaschinen und SEO.svg")
d = "Globale Fragestellungen brauchen innovative Lösungen."
Community.create!(name: "Umwelt und Energietechnologie", description: d, typus: "Thema", icon: "assets/images/icons/Umwelt und Energietechnologie.svg")
d = "Virtuelle und erweiterte Realität in verschiedensten Anwendungsfeldern."
Community.create!(name: "VR AR", description: d, typus: "Thema", icon: "assets/images/icons/VR AR.svg")
d = "Sowas trägt man heute!"
Community.create!(name: "Wearables", description: d, typus: "Thema", icon: "assets/images/icons/Wearables.svg")
d = "Neue und innovative Web-Anwendungen und -Services."
Community.create!(name: "Web-Entwicklung", description: d, typus: "Thema", icon: "assets/images/icons/WebEntwicklung.svg")
d = "Oder die Frage: Wie wird man einzigartig und unverwechselbar?"
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
project.status = 'Published'
project.save!

project.communities << c

cm = Comment.new
cm.user_id = 1
cm.parent_id = 1
cm.parent_type = 'Project'
cm.content = 
cm.save!
