import React from 'react';

function Log() {
    // Sample data for the activity log
    const activities = [
        { id: 1, person: 'Beyonce', activity: 'recruiting agents', status: 'growth' },
        { id: 2, person: 'Meek', activity: 'in the pool', status: 'stuck' },
        { id: 3, person: 'Biebs', activity: 'meeting with FEDs', status: 'snitch' },
        { id: 4, person: 'Usher', activity: 'puttin in work', status: 'active' },
        { id: 5, person: 'Ansem', activity: 'top signal', status: 'fade' },
    ];

    return (
        <div className="p-4 w-[65%] bg-zinc-800 text-white z-50">
            <h2 className="text-2xl font-bold mb-4">Activity Monitor</h2>
            <table className="min-w-full bg-zinc-900 border border-gray-600">
                <thead>
                    <tr className="bg-zinc-700">
                        <th className="py-2 px-4 border-b">People</th>
                        <th className="py-2 px-4 border-b">Activity</th>
                        <th className="py-2 px-4 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(activity => (
                        <tr key={activity.id} className="hover:bg-zinc-600">
                            <td className="py-2 px-4 border-b border-gray-600">{activity.person}</td>
                            <td className="py-2 px-4 border-b border-gray-600">{activity.activity}</td>
                            <td className="py-2 px-4 border-b border-gray-600">{activity.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Log;