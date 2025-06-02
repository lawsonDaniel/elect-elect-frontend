import { NextResponse } from "next/server";
export const GET = async() => {
    try{
         // Connect to the database
        console.log("GET request received");
    return NextResponse.json({message:"working"},{status:200});
    }catch(err:any){
            return NextResponse.json({
              message: err.message || "An error occurred",
              status: false
            }, { status: 500 });
    }
}