import { ApiProperty } from "@nestjs/swagger";
import { ghe } from "@prisma/client";

export class createShowtime {
    @ApiProperty({ description: "ma_rap", type: Number })
    ma_rap: number;

    @ApiProperty({ description: "ma_phim", type: Number })
    ma_phim: number;

    @ApiProperty({ description: "ngay_gio_chieu", type: Date })
    ngay_gio_chieu: Date;

    @ApiProperty({ description: "gia_ve", type: Number })
    gia_ve: number;
}
export interface BoxOffice {
    ma_lich_chieu: number,
    ma_rap: number,
    ma_phim: number,
    ngay_gio_chieu: Date,
    gia_ve: number,
    danh_sach_ghe?: ghe[]
}

export interface BookTickets {
    maLichChieu: number;
    danhSachVe: DanhSachVe[];
}
 interface DanhSachVe {
    maGhe: number;
    giaVe: number;
}