'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
export default function Footer() {
    const pathname = usePathname();
    return(
        <div className="bg-navBlue  w-[100%] px-[7.78%] ">
            <div className=" py-[4.5%]  ">
                <div className="">
                    <Image src="/logo.png" alt="logo" className="w-12 h-12" width={48} height={48} />
                    <p className="text-greyText max-w-[24rem] mt-4">Subscribe to our newsletter for the latest updates on features and releases.</p>
                    <div className="flex flex-col md:flex-row mt-4 gap-3">
                        <input type="text" placeholder="     Your email here" className="bg-white font-medium w-[100%]  md:w-[30.875rem] h-[2.5rem] min-w-[15rem] rounded-lg" />
                        <button className="bg-gold text-white w-[9.75rem] h-[2.5rem] rounded-lg">Subscribe</button>
                    </div>
                    <hr className="bg-[#9CA3AF] h-[0.15rem] mt-14"/>
                    <ul className="list-none flex flex-col md:flex-row mt-5 text-[#D1D5DB] text-md md:text-[1.10rem] gap-5 md:gap-14">
                    <Link href="/">
                    <li className={`cursor-pointer hover:text-white ${pathname === '/' ? 'text-gold font-semibold' : ''}`}>Home</li>
                    </Link>

                    <Link href="/about-us">
                    <li className={`cursor-pointer hover:text-white ${pathname === '/about-us' ? 'text-gold font-semibold' : ''}`}>About Us</li>
                    </Link>
                    <Link href="/contact-us">
                    <li className={`cursor-pointer hover:text-white ${pathname === '/contact-us' ? 'text-gold font-semibold' : ''}`}>Contact</li>
                    </Link>
                        <li className="cursor-pointer hover:text-white">Blog</li>
                    </ul>
                    <div className=" mt-12 md:mt-20 flex flex-col  md:flex-row md:justify-between  ">
                        <p className="text-[#D1D5DB] text-sm ">Copyright@2025 Engineering Dept. All rights reserved</p>
                        <div className="flex flex-row gap-4 m-auto md:m-0 mt-6 md:mt-0">
                            <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-[#FFFFFF1A] overflow-hidden flex items-center justify-center ">
                                <Image src="/facebook-02.png" alt="facebook"  layout='intrinsic' width={30} height={30}/>
                            </div>
                            <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-[#FFFFFF1A] overflow-hidden flex items-center justify-center ">
                            <Image src="/instagram.png" alt="facebook" layout='intrinsic' width={30} height={30}/>
                            </div>
                            <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-[#FFFFFF1A] overflow-hidden flex items-center justify-center ">
                            <Image src="/vector.png" alt="facebook" layout='intrinsic' width={30} height={30}/>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
            </div>

        </div>
    );
}