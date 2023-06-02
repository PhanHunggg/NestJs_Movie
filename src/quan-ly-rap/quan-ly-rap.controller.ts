import { Controller, Get, Post, Body, Patch, Param, Delete, Response, UseGuards } from '@nestjs/common';
import { QuanLyRapService } from './quan-ly-rap.service';
import { ApiTags } from "@nestjs/swagger"
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@ApiTags("QuanLyRap")
@Controller('QuanLyRap')
export class QuanLyRapController {
  constructor(private readonly quanLyRapService: QuanLyRapService) { }

  @Get("/LayThongTinHeThongRap")
  getTheaterSystem(@Response() res: any) {
    return this.quanLyRapService.getTheaterSystem(res);
  }

  @Get("/LayThongTinCumRapTheoHeThong/:maHeThongRap")
  getTheaterClusterSystem(@Response() res: any, @Param("maHeThongRap") maHeThongRap: string) {
    return this.quanLyRapService.getTheaterClusterSystem(res, maHeThongRap);
  }

  @Get("/LayThongTinLichChieuHeThongRap/:maHeThongRap")
  getShowtimeSystem(@Response() res: any, @Param("maHeThongRap") maHeThongRap: string) {
    return this.quanLyRapService.getShowtimeSystem(res, maHeThongRap)
  }

  @Get("/LayThongTinLichChieuPhim/:maPhim")
  getShowtimeDetail(@Response() res: any, @Param("maPhim") maPhim: string) {
    return this.quanLyRapService.getShowtimeDetail(res, maPhim)
  }


}
