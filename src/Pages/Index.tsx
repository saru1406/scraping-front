import { useState, useEffect } from "react";

type Job = {
    id: number;
    title: string;
    show: string;
    price: string;
    tags: string;
    link: string;
    limit: string;
}

function Index() {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            const url = 'http://localhost:80/jobs';
            try {
                const response = await fetch(url, {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                } else {
                    console.error('Failed to fetch jobs:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    console.log(jobs)

    return(
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">案件一覧</h1>
                    {/* <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Banh mi cornhole echo park skateboard authentic crucifix neutra tilde lyft biodiesel artisan direct trade mumblecore 3 wolf moon twee</p> */}
                </div>
                <div className="lg:w-11/12 w-full mx-auto overflow-auto">
                    <table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">タイトル</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">詳細</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">金額</th>
                                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100  rounded-tr rounded-br text-nowrap">求人数</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => 
                                <tr key={job.id} onClick={() => window.open(job.link, '_blank')} style={{ cursor: 'pointer' }}>
                                    <td className="px-4 py-3 border">{job.title}</td>
                                    <td className="px-4 py-3  border">{job.show}</td>
                                    <td className="px-4 py-3  border">{job.price}</td>
                                    <td className="px-4 py-3  border">{job.limit}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </section>
    )
}

export default Index;
