import React from 'react'

const Username = ({ params }) => {
    return (
        <>
            <div className='cover w-full relative'>
                <img className='object-cover w-full h-[350]' src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/75882/264067ce3818401b9f1fbfd1e661c6bf/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/9.jpeg?token-time=1746316800&token-hash=mqMT0elUDzl6aYuIILqjVQEAwvsoT4TeISLnbi_bRoA%3D" alt="" />
                <div className='absolute -bottom-20 right-[46%] border-white border-2 rounded-full'>
                    <img width={150} height={150} className='rounded-full' src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/75882/7399919d08e4470b9a8094f18e47d311/eyJoIjoxMDgwLCJ3IjoxMDgwfQ%3D%3D/4.jpg?token-time=1745798400&token-hash=z4pH1XGoLv_xcq8ODcVxDaCdZzjqlTmxTV4tWyMUx5k%3D" alt="" />
                </div>
            </div>
            <div className="info flex justify-center items-center my-24 flex-col gap-2">
                <div className="font-bold text-lg">
                    @{params.username}
                </div>
                <div className='text-slate-400'>
                    creating Comics
                </div>
                <div className='text-slate-400'>
                    2,868 members . 1,539 posts
                </div>

                <div className="payment flex gap-3 w-4/5 mt-11">
                    <div className="supporters w-1/2 bg-slate-900 text-white rounded-lg p-10">
                    <h2 className="font-bold text-2xl my-5">Supporters</h2>
                    <ul className='mx-5'>
                        <li className='my-2'>Abdul donated $400 with a Message ""</li>
                        <li className='my-2'>Abdul donated $400 with a Message ""</li>
                        <li className='my-2'>Abdul donated $400 with a Message ""</li>
                        <li className='my-2'>Abdul donated $400 with a Message ""</li>
                        <li className='my-2'>Abdul donated $400 with a Message ""</li>
                        <li className='my-2'>Abdul donated $400 with a Message ""</li>
                        <li className='my-2'>Abdul donated $400 with a Message ""</li>
                    </ul>
                    </div>
                    <div className="make-payment w-1/2 bg-slate-900 text-white rounded-lg p-10"></div>
                </div>
            </div>
        </>
    )
}

export default Username 