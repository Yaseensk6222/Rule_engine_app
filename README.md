# Rule Engine Project

## Description
This project implements a Rule Engine that allows users to create, edit, evaluate, and combine rules using an intuitive web interface. The rules can be defined using simple expressions (e.g., `age > 30`), and the system provides functionalities to manage these rules effectively.

## Features
- **Add Rules**: Create new rules and store them in the database.
- **Edit Rules**: Update existing rules with new conditions.
- **Evaluate Rules**: Test rules against provided data to see if they pass.
- **Combine Rules**: Merge multiple rules into a single rule for complex evaluations.
- **Export/Import Rules**: Save rules to a JSON file and load them back into the system.
- **Rule History**: View the history of actions performed on rules.

## Technologies Used
- Flask (Python) for the backend
- PostgreSQL for the database
- HTML/CSS/JavaScript for the frontend
- Bootstrap for styling

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rule-engine.git
   cd rule-engine