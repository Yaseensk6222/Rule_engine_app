async function addRule() {
    const ruleString = document.getElementById('ruleInput').value;
    try {
        const response = await fetch('/create_rule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rule_string: ruleString })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Rule added successfully');
            document.getElementById('ruleInput').value = '';
            fetchRules();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchRules() {
    try {
        const response = await fetch('/rules');
        const rules = await response.json();
        const rulesBody = document.getElementById('rulesBody');
        rulesBody.innerHTML = '';
        rules.forEach(rule => {
            const row = `<tr>
                <td>${rule.id}</td>
                <td>${rule.rule_string}</td>
                <td>${JSON.stringify(rule.ast)}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteRule(${rule.id})">Delete</button>
                </td>
            </tr>`;
            rulesBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function editRule() {
    const ruleId = document.getElementById('editRuleId').value;
    const ruleString = document.getElementById('editRuleString').value;
    try {
        const response = await fetch(`/update_rule/${ruleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rule_string: ruleString })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Rule updated successfully');
            document.getElementById('editRuleId').value = '';
            document.getElementById('editRuleString').value = '';
            fetchRules();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteRule(ruleId) {
    try {
        const response = await fetch(`/delete_rule/${ruleId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            fetchRules();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function evaluateRule() {
    const ruleId = document.getElementById('evalRuleId').value;
    const evalData = JSON.parse(document.getElementById('evalData').value);
    try {
        const response = await fetch('/evaluate_rule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rule_id: ruleId, data: evalData })
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('evaluationResult').innerText = `Result: ${data.result}`;
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function combineRules() {
    const ruleIds = document.getElementById('combineRuleIds').value.split(',').map(id => parseInt(id.trim()));
    try {
        const response = await fetch('/combine_rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ruleIds)
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('combinedResult').innerText = `Combined AST: ${JSON.stringify(data.combined_ast)}`;
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function exportRules() {
    try {
        const response = await fetch('/export_rules');
        const rules = await response.json();
        const blob = new Blob([JSON.stringify(rules, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rules.json';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function importRules() {
    const file = document.getElementById('importFile').files[0];
    if (!file) {
        alert('Please select a file to import');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const rules = JSON.parse(e.target.result);
        try {
            const response = await fetch('/import_rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rules)
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchRules();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    reader.readAsText(file);
}

async function getRuleHistory() {
    try {
        const response = await fetch('/rule_history');
        const history = await response.json();
        const ruleHistoryDiv = document.getElementById('ruleHistory');
        ruleHistoryDiv.innerHTML = '';
        history.forEach(entry => {
            ruleHistoryDiv.innerHTML += `<p>${entry.timestamp} - ${entry.action}: ${JSON.stringify(entry.rule)}</p>`;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch rules on page load
window.onload = fetchRules;
