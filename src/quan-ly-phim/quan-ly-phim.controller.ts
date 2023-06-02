import { Controller, Get, Post, Body, Patch, Param, Delete, Response, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { QuanLyPhimService } from './quan-ly-phim.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { banner, movie } from '@prisma/client';
import { FileUploadDto, addMovieInter, movieUpdate } from './interface/movie';
import { ApiTags, ApiBody, ApiConsumes } from "@nestjs/swagger"
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@ApiTags("QuanLyPhim")
@Controller('QuanLyPhim')
export class QuanLyPhimController {
  constructor(private readonly quanLyPhimService: QuanLyPhimService) { }

  @Get("/lay-danh-sach-phim")
  getMovieList(@Response() res: any) {
    return this.quanLyPhimService.getMovieList(res);
  }

  @Get("/lay-danh-sach-banner")
  getBanner(@Response() res: any) {
    return this.quanLyPhimService.getBanner(res);
  }

  @Get("/lay-thong-tin-phim/:id")
  getMovieDetail(@Response() res: any, @Param("id") id: string) {
    return this.quanLyPhimService.getMovieDetail(res, id)
  }

  @Post("/them-phim")
  @UseInterceptors(FileInterceptor('hinh_anh', {
    storage: diskStorage({
      destination: process.cwd() + "/public/img/movie",
      filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  addMovie(@UploadedFile() file: Express.Multer.File, @Body() movieData: addMovieInter, @Response() res: any) {
    return this.quanLyPhimService.createMovie(movieData, file.filename, res)
  }


  @Post("/update-movie-detail/:id")
  updateMovieDetail(@Param("id") id: string, @Body() body: movieUpdate, @Response() res: any) {
    return this.quanLyPhimService.updateMovieDetail(id, body, res)
  }


  @Post("/update-img-movie/:id")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Movie image upload",
    type: FileUploadDto
  })
  @UseInterceptors(FileInterceptor('hinh_anh', {
    storage: diskStorage({
      destination: process.cwd() + "/public/img/movie",
      filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  updateImgMovie(@Response() res: any, @UploadedFile() file: Express.Multer.File, @Param("id") id: string) {
    return this.quanLyPhimService.updateImgDetails(res, id, file.filename)
  }


  @Post("/them-banner")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Banner image upload",
    type: FileUploadDto
  })
  @UseInterceptors(FileInterceptor('hinh_anh', {
    storage: diskStorage({
      destination: process.cwd() + "/public/img/banner",
      filename: (req, file, callback) => callback(null, Date.now() + "_" + file.originalname)
    })
  }))
  addBanner(@UploadedFile() file: Express.Multer.File, @Body() bannerData: banner, @Response() res: any) {
    return this.quanLyPhimService.addBanner(bannerData, file.filename, res)
  }

  // doi lam lại
  @Delete("/delete-movie/:maPhim")
  deleteMovie(@Response() res: any, @Param("maPhim") maPhim: string) {
    return this.quanLyPhimService.deleteMovie(res, maPhim)
  }


  // // tạo ghế
  // @Post("/tao-ghe")
  // createChair(@Response() res: any){
  //   return this.quanLyPhimService.createChair(res)
  // }
}
