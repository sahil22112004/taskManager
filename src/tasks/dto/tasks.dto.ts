
import { IsMongoId,IsArray, IsString, IsEmail, IsNumberString,IsNotEmpty ,ValidateNested ,ArrayMinSize ,ArrayMaxSize, Min, IsDate, IsDateString} from 'class-validator';
import { Type ,Transform ,} from 'class-transformer';
import { createsubTasksDto } from './subTasks.dto';

export class createTasksDto{

    @IsString({message:'enter only string'})
    @IsNotEmpty({message:'this field cannot be emty'})
    title:string

    @IsMongoId()
    @IsNotEmpty({message:'this field cannot be emty'})
    userid:string

    @Type(() => Date)
    @IsNotEmpty()
    startTime: Date;

    @Type(() => Date)
    @IsNotEmpty()
    endTime: Date;


    @IsArray()
    @ArrayMinSize(1) 
    @ArrayMaxSize(5)
    @ValidateNested({ each: true }) 
    @Type(() => createsubTasksDto) 
    subtasks: createsubTasksDto[]

    

}