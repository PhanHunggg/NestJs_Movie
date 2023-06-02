
import { Controller, Get, Post, Body, Patch, Param, Delete, Response, UseGuards } from '@nestjs/common';
import { QuanLyDatVeService } from './quan-ly-dat-ve.service';
import { ApiTags } from "@nestjs/swagger"
import { BookTickets, createShowtime } from './interface/datVe';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@ApiTags("QuanLyDatVe")
@Controller('QuanLyDatVe')
export class QuanLyDatVeController {
  constructor(private readonly quanLyDatVeService: QuanLyDatVeService) { }


  @Post('/tao-lich-chieu')
  createShowtime(@Response() res: any, @Body() body: createShowtime,) {
    return this.quanLyDatVeService.createShowtime(res, body)
  }

  @Post('/dat-ve/:maNguoiDung')
  bookTickets(@Response() res: any, @Body() body: BookTickets, @Param("maNguoiDung") maNguoiDung:number) {
    return this.quanLyDatVeService.bookTickets(res, body, maNguoiDung)
  }

  @Get('/lay-danh-sach-phong-ve/:maLichChieu')
  getBoxOfficeList(@Response() res: any, @Param('maLichChieu') maLichChieu: number) {
    return this.quanLyDatVeService.getBoxOfficeList(res, maLichChieu)
  }

}
