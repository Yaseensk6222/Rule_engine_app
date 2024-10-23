def evaluate_rule(rule, input_data):
    # Example rule evaluation logic, modify as needed
    condition = rule.get('condition')
    action = rule.get('action')

    # Assume condition is a Python expression
    if eval(condition, {}, input_data):
        return action
    return "Condition not met"
