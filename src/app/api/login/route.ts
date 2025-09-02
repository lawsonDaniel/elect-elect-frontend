import { NextResponse } from "next/server";
export const POST = async() => {
    try{
       //login logic here
    return NextResponse.json({message:"working"},{status:200});
    }catch(err:any){
            return NextResponse.json({
              message: err.message || "An error occurred",
              status: false
            }, { status: 500 });
    }
}