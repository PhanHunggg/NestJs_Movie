import { Controller, Get, Post, Body, Patch, Param, Delete, Response, Put, UseGuards } from '@nestjs/common';
import { QuanLyNguoiDungService } from './quan-ly-nguoi-dung.service';
import { SignUpInterface, loginInterFace } from './interface/user';
import { ApiTags } from "@nestjs/swagger"
import { AuthGuard } from '@nestjs/passport';

@ApiTags("QuanLyNguoiDung")
@Controller('QuanLyNguoiDung')
export class QuanLyNguoiDungController {
  constructor(private readonly quanLyNguoiDungService: QuanLyNguoiDungService) { }

  @Post("/login")
  login(@Response() res: any, @Body() body: loginInterFace) {
    return this.quanLyNguoiDungService.login(res, body);
  }

  @Post("/sign-up")
  signUp(@Response() res: any, @Body() body: SignUpInterface) {
    return this.quanLyNguoiDungService.signUp(res, body);
  }

  @Post("/them-nguoi-dung")
  addUser(@Response() res: any, @Body() body: SignUpInterface) {
    return this.quanLyNguoiDungService.addUser(res, body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/cap-nhat-nguoi-dung/:id")
  updateUser(@Response() res: any, @Body() body: SignUpInterface, @Param("id") id: string) {
    return this.quanLyNguoiDungService.updateUser(res, body, id);
  }

  @Get("/loai-nguoi-dung")
  userType(@Response() res: any) {
    return this.quanLyNguoiDungService.userType(res)
  }

  @Get("/danh-sach-nguoi-dung")
  userList(@Response() res: any) {
    return this.quanLyNguoiDungService.userList(res)
  }


  @Get("/tim-kiem-nguoi-dung/:username")
  findUser(@Response() res: any, @Param("username") username: string) {
    return this.quanLyNguoiDungService.findUser(res, username)
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/thong-tin-tai-khoan/:maNguoiDung")
  getUserDetail(@Response() res: any, @Param('maNguoiDung') maNguoiDung: string) {
    return this.quanLyNguoiDungService.getUserDetail(res, maNguoiDung)
  }

  @Delete("/xoa-nguoi-dung/:maNguoiDung")
  deleteUser(@Response() res: any, @Param("maNguoiDung") maNguoiDung: string) {
    return this.quanLyNguoiDungService.deleteUser(res, maNguoiDung)
  }

}
