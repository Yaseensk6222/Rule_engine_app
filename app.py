from flask import Flask, request, jsonify, render_template
import json
from datetime import datetime

app = Flask(__name__)

# In-memory storage for rules and rule history
rules = []
rule_history = []

# Function to generate AST from a rule string
def generate_ast(rule_string):
    # Basic AST generation (this can be more complex depending on requirements)
    return {"ast": f"AST representation of ({rule_string})"}

# Function to add history entry
def add_history(action, rule):
    rule_history.append({
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": action,
        "rule": rule
    })

# Create a rule
@app.route('/create_rule', methods=['POST'])
def create_rule():
    data = request.json
    rule_string = data.get('rule_string')
    if rule_string:
        rule_id = len(rules) + 1
        rule_ast = generate_ast(rule_string)
        new_rule = {"id": rule_id, "rule_string": rule_string, "ast": rule_ast}
        rules.append(new_rule)
        add_history("Created", new_rule)
        return jsonify(new_rule), 201
    return jsonify({"message": "Invalid rule string"}), 400

# Fetch all rules
@app.route('/rules', methods=['GET'])
def get_rules():
    return jsonify(rules), 200

# Update a rule
@app.route('/update_rule/<int:rule_id>', methods=['PUT'])
def update_rule(rule_id):
    data = request.json
    rule_string = data.get('rule_string')
    rule = next((r for r in rules if r['id'] == rule_id), None)
    if rule and rule_string:
        rule['rule_string'] = rule_string
        rule['ast'] = generate_ast(rule_string)
        add_history("Updated", rule)
        return jsonify(rule), 200
    return jsonify({"message": "Rule not found or invalid"}), 400

# Delete a rule
@app.route('/delete_rule/<int:rule_id>', methods=['DELETE'])
def delete_rule(rule_id):
    global rules
    rule = next((r for r in rules if r['id'] == rule_id), None)
    if rule:
        rules = [r for r in rules if r['id'] != rule_id]
        add_history("Deleted", rule)
        return jsonify({"message": "Rule deleted successfully"}), 200
    return jsonify({"message": "Rule not found"}), 404

# Evaluate a rule
@app.route('/evaluate_rule', methods=['POST'])
def evaluate_rule():
    data = request.json
    rule_id = data.get('rule_id')
    input_data = data.get('data')
    rule = next((r for r in rules if r['id'] == int(rule_id)), None)
    if rule:
        # Simple evaluation based on rule string
        # In a real scenario, this could involve AST interpretation and execution
        result = eval(rule['rule_string'].replace("age", str(input_data.get('age', 0))))
        return jsonify({"result": result}), 200
    return jsonify({"message": "Rule not found"}), 404

# Combine multiple rules into one AST
@app.route('/combine_rules', methods=['POST'])
def combine_rules():
    rule_ids = request.json
    combined_ast = {"combined_ast": [r['ast'] for r in rules if r['id'] in rule_ids]}
    return jsonify(combined_ast), 200

# Export rules
@app.route('/export_rules', methods=['GET'])
def export_rules():
    return jsonify(rules), 200

# Import rules
@app.route('/import_rules', methods=['POST'])
def import_rules():
    data = request.json
    global rules
    rules = data
    return jsonify({"message": "Rules imported successfully"}), 200

# Get rule history
@app.route('/rule_history', methods=['GET'])
def rule_history_route():
    return jsonify(rule_history), 200

# Render the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
