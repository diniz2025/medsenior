
import React from 'react';

interface Plan {
    name: string;
    age44_48: string;
    age59plus: string;
    details: string;
}

interface PlanTableProps {
    title: string;
    plans: Plan[];
    hospitals: string[];
    labs: string[];
}

const PlanTable: React.FC<PlanTableProps> = ({ title, plans, hospitals, labs }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 my-2 w-full max-w-full overflow-x-auto">
        <h3 className="text-lg font-bold text-center text-orange-500 mb-4">{title}</h3>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-blue-600 dark:bg-blue-700">
                <tr>
                    <th scope="col" className="px-4 py-3">Plano</th>
                    <th scope="col" className="px-4 py-3">44-48 anos</th>
                    <th scope="col" className="px-4 py-3">59+ anos</th>
                </tr>
            </thead>
            <tbody>
                {plans.map((plan, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                        <th scope="row" className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            {plan.name}
                            <div className="text-xs text-gray-500">{plan.details}</div>
                        </th>
                        <td className="px-4 py-4 font-bold text-orange-500">{plan.age44_48}</td>
                        <td className="px-4 py-4 font-bold text-orange-500">{plan.age59plus}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <h4 className="font-semibold text-gray-800 dark:text-white">🏥 Hospitais Inclusos:</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">{hospitals.join(' | ')}</p>
            <h4 className="font-semibold mt-2 text-gray-800 dark:text-white">🔬 Laboratórios Inclusos:</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">{labs.join(' | ')}</p>
        </div>
    </div>
  );
};

export default PlanTable;
