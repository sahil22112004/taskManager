
import { IsString, IsEmail, IsNumberString,IsNotEmpty } from 'class-validator';

export class createsubTasksDto{
    // @IsNumberString()
    // @IsNotEmpty({message:'this field cannot be emty'})
    // id:string

    @IsString({message:'enter only string'})
    @IsNotEmpty({message:'this field cannot be emty'})
    title:string

    // @IsString({message:'enter only string'})
    // @IsNotEmpty({message:'this field cannot be emty'})
    // status:string

    // @IsNumberString()
    // @IsNotEmpty({message:'this field cannot be emty'})
    // taskid:string

}