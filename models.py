# import sqlalchemy
from flask_sqlalchemy import SQLAlchemy

# intialize a variable for our DB by running SQLAlchemy. db is standard name
db = SQLAlchemy()

default_image = "https://tinyurl.com/demo-cupcake"
# associate Flask app with our DB
# don't want to connect to a db every single time you run your models file
# so we wrap it in a function and make it callable
def connect_db(app):
    """Connect to db"""
    db.app = app
    db.init_app(app)

# Models go below!
# standard to use singular version of name for class, plural version of name for actual table name
class Cupcake(db.Model):
    """Cupcake"""

    __tablename__ = "cupcakes"

    # define the columns of the table / nullable is True by default / default values only work if used by this model
    # if you try to add something to the db direcly using SQL the default is not there
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.Text, nullable=False, unique=True)
    size = db.Column(db.Text, nullable=False) 
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.Text, nullable=False, default=default_image)

    def serialize(self):
        return {
            "id": self.id,
            "flavor": self.flavor,
            "size": self.size,
            "rating": self.rating,
            "image": self.image
        }

    def __repr__(self):
        """Show info about cupcake"""

        c = self
        return f"<id={c.id} flavor={c.flavor} size={c.size} rating={c.rating}>"
