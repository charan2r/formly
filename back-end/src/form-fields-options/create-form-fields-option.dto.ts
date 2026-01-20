/* eslint-disable prettier/prettier */
import { IsString, IsUUID } from 'class-validator';

export class CreateFormFieldsOptionDto {
  @IsString()
  option: string;

  @IsUUID()
  formFieldId: string;
}
