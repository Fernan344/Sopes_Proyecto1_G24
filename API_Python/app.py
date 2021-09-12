from flask import Flask, jsonify, request

app = Flask(__name__)

from products import products

@app.route('/ping')
def ping():
    return jsonify({"message": "pong!!"})

@app.route('/products', methods=['GET'])
def getProducts():
    return jsonify({"products": products, "message": "Lista Completa :v"})

@app.route('/products/<string:product_name>', methods=['GET'])
def getProduct(product_name):
    productFound = [product for product in products if product['name'] == product_name]

    if (len(productFound)>0):
        return jsonify({"product": productFound})
    return jsonify({"message": "NOT FOUND"})

@app.route('/products', methods=['POST'])
def createProduct():    
    print(request.json)
    new_product = {
        "name": request.json['name'],
        "price": request.json['price'],
        "quantity": request.json['quantity']
    }
    products.append(new_product)
    return jsonify({"message": "succes!!", "products": products})
    

if __name__ == '__main__':
    app.run(debug=True, port=4500)