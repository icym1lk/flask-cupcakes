# import Flask and any libraries you want to use
from flask import Flask, request, jsonify, render_template, redirect, flash, session
# get db related stuff from models.py
from models import db, connect_db, Cupcake
# get forms from forms.py
# from forms import AddPetForm, EditPetForm

# instantiate and instance of Flask. app is standard name
app = Flask(__name__)

# specify which RDBMS you're using (i.e. postgresql) and name of DB you want app to use. "postgresql://ownername:yourpassword@localhost/databasename" OR "postgresql:///databasename"
# must do before you associate to your app or else it will error out
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///cupcakes"
# remove track modifications warning at startup
app.config["SQLALCHEMY_TRACKMODIFICATIONS"] = False
# print all SQL statements to terminal (helpful in debugging and learning the ORM method calls)
app.config["SQLALCHEMY_ECHO"] = True

# connect to db
connect_db(app)

# import debug toolbar
from flask_debugtoolbar import DebugToolbarExtension
# required by debugtoolbar for debugging session
app.config["SECRET_KEY"] = "secret"
# makes sure redirects aren't stopped by the debugtoolbar
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
# instantiate class on our app
debug = DebugToolbarExtension(app)

@app.route("/")
def homepage():

    return render_template("homepage.html")

@app.route("/api/cupcakes")
def list_cupcakes():
    """List all cupcakes in db. No limit currently set."""

    all_cupcakes = [item.serialize() for item in Cupcake.query.all()]
    return jsonify(cupcakes=all_cupcakes)

@app.route("/api/cupcakes/<int:id>")
def get_cupcake(id):
    """Select cupcake by id."""

    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.serialize())

@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    """Create new cupcake and insert into db.
    Could use error handling as none currently exists.
    """

    new_cupcake = Cupcake(
        flavor=request.json["flavor"],
        size=request.json["size"],
        rating=request.json["rating"],
        image=request.json["image"]
        )

    db.session.add(new_cupcake)
    db.session.commit()

    json_response = jsonify(cupcake=new_cupcake.serialize())
    return (json_response, 201)

@app.route("/api/cupcakes/<int:id>", methods=["PATCH"])
def update_cupcake(id):
    """Select cupcake by id and update it."""

    cupcake = Cupcake.query.get_or_404(id)
    cupcake.flavor = request.json.get("flavor", cupcake.flavor)     
    cupcake.size = request.json.get("size", cupcake.size)     
    cupcake.rating = request.json.get("rating", cupcake.rating)     
    cupcake.image = request.json.get("image", cupcake.image)

    db.session.add(cupcake)
    db.session.commit()     

    return jsonify(cupcake=cupcake.serialize())

@app.route("/api/cupcakes/<int:id>", methods=["DELETE"])
def delete_cupcake(id):
    """Select cupcake by id and delete it."""

    cupcake = Cupcake.query.get_or_404(id)
    flavor = cupcake.flavor
    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(message=f"{flavor} deleted.")