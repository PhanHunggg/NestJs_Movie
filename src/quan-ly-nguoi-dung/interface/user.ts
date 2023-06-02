import { ApiProperty } from "@nestjs/swagger"



export class loginInterFace {
    @ApiProperty({description: "tai_khoan", type: String})
    tai_khoan: string;

    @ApiProperty({description: "mat_khau", type: String})
    mat_khau: string;
}

export class SignUpInterface {
    @ApiProperty({description: "tai_khoan", type: String})
    tai_khoan: string

    @ApiProperty({description: "ho_ten", type: String})
    ho_ten: string

    @ApiProperty({description: "email", type: String})
    email: string

    @ApiProperty({description: "so_dt", type: Number})
    so_dt: number

    @ApiProperty({description: "mat_khau", type: String})
    mat_khau: string

    @ApiProperty({description: "loai_nguoi_dung", type: String})
    loai_nguoi_dung?: string
}