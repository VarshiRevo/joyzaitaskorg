import { useEffect, useRef } from 'react';

const OrgChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data.length) return;

    const buildHierarchy = () => {
      const employees = {};
      const rootNodes = [];


      data.forEach(emp => {
        employees[emp.Email] = {
          ...emp,
          children: []
        };
      });

      data.forEach(emp => {
        if (emp.ReportsTo) {
          const managers = emp.ReportsTo.split(';');

          if (managers[0] && employees[managers[0]]) {
            employees[managers[0]].children.push(employees[emp.Email]);
          } else {
            rootNodes.push(employees[emp.Email]);
          }
        } else {
          rootNodes.push(employees[emp.Email]);
        }
      });

      return rootNodes;
    };

    const hierarchy = buildHierarchy();
    renderChart(hierarchy);

  }, [data]);

  const renderChart = (hierarchy) => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = '';

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'tree-wrapper';

    const createNode = (employee, depth = 0) => {
      const container = document.createElement('li');

      const nodeEl = document.createElement('div');
      nodeEl.className = 'tree-node';

      const roleClass = employee.Role.toLowerCase();
      nodeEl.classList.add(roleClass);

      const nameEl = document.createElement('div');
      nameEl.className = 'node-name';
      nameEl.textContent = employee.FullName;

      const roleEl = document.createElement('div');
      roleEl.className = 'node-role';
      roleEl.textContent = employee.Role;

      const emailEl = document.createElement('div');
      emailEl.className = 'node-email';
      emailEl.textContent = employee.Email;

      nodeEl.appendChild(nameEl);
      nodeEl.appendChild(roleEl);
      nodeEl.appendChild(emailEl);
      container.appendChild(nodeEl);

      nodeEl.style.animationDelay = `${depth * 0.1}s`;

      if (employee.children && employee.children.length) {
        const childrenUl = document.createElement('ul');
        employee.children.forEach(child => {
          childrenUl.appendChild(createNode(child, depth + 1));
        });
        container.appendChild(childrenUl);
      }

      return container;
    };



    const ul = document.createElement('ul');
    ul.className = 'tree';

    hierarchy.forEach(root => {
      ul.appendChild(createNode(root));
    });

    chartWrapper.appendChild(ul);
    chartRef.current.appendChild(chartWrapper);
  };



  return (
    <div className="org-chart-container">
      <h2>Organization Structure Preview</h2>

      <div className="chart-responsive-container">
        <div className="chart-scroll-container">
          <div ref={chartRef} className="chart-content"></div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;