
import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { BookTickets, BoxOffice, createShowtime } from './interface/datVe';
import { errCode, failCode, successCode } from 'src/config/response';

@Injectable()
export class QuanLyDatVeService {

  prisma = new PrismaClient();

  async createShowtime(res: any, showtime: createShowtime) {
    const checkRap = await this.prisma.rapPhim.findFirst({
      where: {
        ma_rap: showtime.ma_rap
      }
    })

    if (!checkRap) {
      errCode(res, showtime.ma_rap, "Không tìm thấy rạp")
      return
    }

    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        ma_phim: showtime.ma_phim
      }
    })

    if (!checkMovie) {
      errCode(res, showtime.ma_phim, "Không tìm thấy phim")
      return
    }


    await this.prisma.lichChieu.create({
      data: {
        ma_rap: showtime.ma_rap,
        ma_phim: showtime.ma_phim,
        ngay_gio_chieu: new Date(showtime.ngay_gio_chieu),
        gia_ve: showtime.gia_ve
      }
    })
    successCode(res, showtime, "Xử lí thành công")
  }

  async getBoxOfficeList(res: any, maLichChieu: number) {
    try {
      const checkBox: BoxOffice = await this.prisma.lichChieu.findFirst({
        where: {
          ma_lich_chieu: Number(maLichChieu)
        },
        include: {
          movie: true,

        }
      })

      if (!checkBox)
        errCode(res, maLichChieu, "Không tìm thấy mã lịch chiếu")


      const checkTheater = await this.prisma.ghe.findMany({
        where: {
          ma_rap: checkBox.ma_rap
        }
      })

      checkBox.danh_sach_ghe = checkTheater

      successCode(res, checkBox, "Xử lí thành công")



    } catch (error) {
      failCode(res, error.message)
    }
  }

  async bookTickets(res: any, ticket: BookTickets, maNguoiDung: number) {
    const checkUser = await this.prisma.nguoiDung.findFirst({
      where: {
        ma_nguoi_dung: Number(maNguoiDung)
      }
    })

    if (!checkUser) {
      errCode(res, maNguoiDung, "Xử lí thất bại")
      return
    }

    const checkBox = await this.prisma.lichChieu.findFirst({
      where: {
        ma_lich_chieu: ticket.maLichChieu
      }
    })

    if (!checkBox) {
      errCode(res, ticket.maLichChieu, "Không tìm thấy lịch chiếu")
      return
    }

    const chairList = ticket.danhSachVe

    let isValid: boolean = false

    for (let index: number = 0; index < chairList.length; index++) {
      const checkChair = await this.prisma.ghe.findFirst({
        where: {
          ma_rap: checkBox.ma_rap,
          ma_ghe: chairList[index].maGhe
        }
      })
      if (!checkChair) {
        errCode(res, checkChair, "Không tìm thấy ghế")
        return
      }

      if (checkChair.da_dat) {
        isValid = true
        continue
      }
    }

    if (isValid) {
      errCode(res, chairList, "Ghế đã đặt")
      return
    }

    for (let idx = 0; idx < chairList.length; idx++) {

      await this.prisma.ghe.update({
        data: {
          da_dat: true
        },
        where: {
          ma_ghe: chairList[idx].maGhe

        }
      })

    }

    let chairIdList = [];
    chairList.forEach(idx => {
      chairIdList.push(idx.maGhe)
    });

    const chairIdListString = chairIdList.join(", ")



    await this.prisma.datVe.create({
      data: {
        ma_nguoi_dung: Number(maNguoiDung),
        ma_lich_chieu: checkBox.ma_lich_chieu,
        ma_ghe: chairIdListString
      }

    })



    successCode(res, chairList, "Xử lí thành công")

  }

}
