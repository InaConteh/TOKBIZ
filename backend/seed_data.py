import os
import random
from app import create_app, db
from app.models import User, Business, Product, Sale, SaleItem, Debtor

def seed_data(count=50):
    app = create_app("development")
    with app.app_context():
        # Clear existing data if necessary or just add new
        # db.drop_all()
        # db.create_all()

        categories = ["Retail", "Service", "Manufacturing", "Farming", "Technology"]
        locations = ["Freetown", "Bo", "Kenema", "Makeni", "Koidu"]
        product_names = ["Rice", "Palm Oil", "Cassava", "Soap", "Battery", "Lantern", "T-shirt", "Water Bottle"]

        users_credentials = []

        for i in range(1, count + 1):
            name = f"User {i}"
            email = f"user{i}@example.com"
            password = f"password{i:03d}"

            # Check if user exists
            user = User.query.filter_by(email=email).first()
            if not user:
                user = User(name=name, email=email)
                user.password = password
                db.session.add(user)
                db.session.flush() # Get ID

            users_credentials.append({"email": email, "password": password})

            # Create a business for each user
            if not user.businesses:
                business = Business(
                    owner_id=user.id,
                    name=f"{name}'s Venture",
                    category=random.choice(categories),
                    location=random.choice(locations)
                )
                db.session.add(business)
                db.session.flush()

                # Add some products
                products = []
                for p_name in random.sample(product_names, 3):
                    product = Product(
                        business_id=business.id,
                        name=p_name,
                        price=random.uniform(5.0, 100.0),
                        quantity=random.randint(10, 100)
                    )
                    db.session.add(product)
                    products.append(product)
                db.session.flush()

                # Add some sales
                for _ in range(random.randint(3, 7)):
                    sale = Sale(business_id=business.id, total_amount=0)
                    db.session.add(sale)
                    db.session.flush()

                    total = 0
                    for _ in range(random.randint(1, 3)):
                        p = random.choice(products)
                        qty = random.randint(1, 5)
                        price = p.price
                        item = SaleItem(sale_id=sale.id, product_id=p.id, quantity=qty, price=price)
                        db.session.add(item)
                        total += qty * price

                    sale.total_amount = total

                # Add a debtor
                debtor = Debtor(
                    business_id=business.id,
                    customer_name=f"Customer of {name}",
                    amount_owed=random.uniform(20.0, 200.0),
                    status="Outstanding"
                )
                db.session.add(debtor)

        db.session.commit()
        print(f"Successfully seeded {count} users and their businesses.")

        # Save credentials to a file for easy access
        with open("seeded_users.txt", "w") as f:
            f.write("Email | Password\n")
            f.write("-" * 30 + "\n")
            for cred in users_credentials:
                f.write(f"{cred['email']} | {cred['password']}\n")

if __name__ == "__main__":
    seed_data(50)
