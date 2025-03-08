export const validateOrgChart = (data) => {
    const errors = [];
    const employees = {};

    data.forEach(emp => {
      employees[emp.Email] = {
        ...emp,
        managers: emp.ReportsTo ? emp.ReportsTo.split(';').filter(m => m) : [],
        subordinates: []
      };
    });
  
    data.forEach(emp => {
      const email = emp.Email;
      const role = emp.Role;
      const reportsTo = emp.ReportsTo;
    
      if (role !== 'Root' && (!reportsTo || reportsTo === '')) {
        errors.push({
          row: email,
          message: `${emp.FullName} (${role}) does not report to anyone. All non-Root employees must report to someone.`
        });
      }
    
      if (reportsTo && employees[reportsTo] && employees[reportsTo].Role === 'Root' && role !== 'Admin') {
        errors.push({
          row: email,
          message: `${emp.FullName} (${role}) reports to Root, but only Admins can report to Root.`
        });
      }
 
      if (role === 'Manager') {
        const managerEmails = reportsTo ? reportsTo.split(';') : [];
        
        for (const managerEmail of managerEmails) {
          if (employees[managerEmail]) {
            const managerRole = employees[managerEmail].Role;
            
            if (managerRole !== 'Manager' && managerRole !== 'Admin') {
              errors.push({
                row: email,
                message: `${emp.FullName} (Manager) reports to ${employees[managerEmail].FullName} (${managerRole}), but Managers can only report to other Managers or Admins.`
              });
            }
          } else if (managerEmail) {
            errors.push({
              row: email,
              message: `${emp.FullName} reports to non-existent manager: ${managerEmail}`
            });
          }
        }
      }
  
      if (role === 'Caller') {
        const managerEmails = reportsTo ? reportsTo.split(';') : [];
        
        for (const managerEmail of managerEmails) {
          if (employees[managerEmail]) {
            const managerRole = employees[managerEmail].Role;
            
            if (managerRole !== 'Manager') {
              errors.push({
                row: email,
                message: `${emp.FullName} (Caller) reports to ${employees[managerEmail].FullName} (${managerRole}), but Callers can only report to Managers.`
              });
            }
          } else if (managerEmail) {
            errors.push({
              row: email,
              message: `${emp.FullName} reports to non-existent manager: ${managerEmail}`
            });
          }
        }
      }
    
      if (reportsTo && reportsTo.includes(';')) {
        errors.push({
          row: email,
          message: `${emp.FullName} reports to multiple managers (${reportsTo}). Each user should have exactly one parent.`
        });
      }

      if (reportsTo) {
        const managerEmails = reportsTo.split(';');
        
        for (const managerEmail of managerEmails) {
          if (employees[managerEmail]) {
            employees[managerEmail].subordinates.push(email);
          }
        }
      }
    });
  //cycle
    const detectCycles = () => {
      const visited = new Set();
      const recStack = new Set();
      
      const checkCycle = (email) => {
        if (!visited.has(email)) {
          visited.add(email);
          recStack.add(email);
          
          const employee = employees[email];
          
          for (const subordinate of employee.subordinates) {
            if (!visited.has(subordinate) && checkCycle(subordinate)) {
              return true;
            } else if (recStack.has(subordinate)) {
            
              const cycle = [];
              let current = email;
              
              do {
                cycle.push(current);
                
                for (const sub of employees[current].subordinates) {
                  if (recStack.has(sub)) {
                    current = sub;
                    break;
                  }
                }
              } while (current !== email && cycle.length < 100);
              
              cycle.push(email);
              
              const cycleNames = cycle.map(e => employees[e].FullName).join(' → ');
              
              errors.push({
                row: 'Cycle Detected',
                message: `Reporting cycle detected: ${cycleNames}`
              });
              
              return true;
            }
          }
        }
        
        recStack.delete(email);
        return false;
      };
  
      for (const email in employees) {
        if (!visited.has(email)) {
          checkCycle(email);
        }
      }
    };
    
    detectCycles();
    
    return {
      valid: errors.length === 0,
      errors
    };
  };