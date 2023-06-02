import { Injectable } from '@nestjs/common';

import { PrismaClient, banner, movie } from '@prisma/client';
import { errCode, failCode, successCode } from 'src/config/response';
import { addMovieInter, movieUpdate } from './interface/movie';


@Injectable()
export class QuanLyPhimService {

  prisma = new PrismaClient();

  async getMovieList(res: any) {
    try {
      const movieList = await this.prisma.movie.findMany();
      successCode(res, movieList, "Xử lý thành công")
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getBanner(res: any) {
    try {
      const movieList = await this.prisma.banner.findMany();
      successCode(res, movieList, "Xử lý thành công")
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getMovieDetail(res: any, id: string) {
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        ma_phim: Number(id),
      }
    })

    if (!checkMovie) {
      errCode(res, id, "Không tìm thấy phim")
      return
    }

    successCode(res, checkMovie, "Xử lí thành công")
  }

  async createMovie(movieData: addMovieInter, img: string, res: any): Promise<void> {
    const { ten_phim, trailer, mo_ta, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = movieData;

    const movie = await this.prisma.movie.create({
      data: {
        ten_phim,
        trailer,
        hinh_anh: img,
        mo_ta,
        ngay_khoi_chieu: new Date(ngay_khoi_chieu),
        danh_gia: Number(danh_gia),
        hot: Boolean(hot),
        dang_chieu: Boolean(dang_chieu),
        sap_chieu: Boolean(sap_chieu),
      },
    });

    successCode(res, movie, "Xử lí thành công")
  }

  async addBanner(bannerData: banner, imgName: string, res: any): Promise<void> {
    const { ma_phim } = bannerData

    const banner = await this.prisma.banner.create({
      data: {
        ma_phim: Number(ma_phim),
        hinh_anh: imgName
      }
    })

    successCode(res, banner, "Xử lí thành công")
  }

  async updateMovieDetail(id: string, movie: movieUpdate, res: any) {
    try {
      const checkMovie = await this.prisma.movie.findFirst({
        where: {
          ma_phim: Number(id),
        }
      })

      if (!checkMovie) {
        errCode(res, id, "Xử lý thất bại")
        return
      }
      const { ten_phim, trailer, mo_ta, ngay_khoi_chieu, danh_gia, hot, dang_chieu, sap_chieu } = movie


      await this.prisma.movie.update({
        data: {
          ten_phim,
          trailer,
          mo_ta,
          ngay_khoi_chieu: new Date(ngay_khoi_chieu),
          danh_gia: Number(danh_gia),
          hot: Boolean(hot),
          dang_chieu: Boolean(dang_chieu),
          sap_chieu: Boolean(sap_chieu),
        },
        where: {
          ma_phim: Number(id)
        }
      })

      successCode(res, movie, "Update phim thành công")
    } catch (error) {
      failCode(res, error.message)
    }
  }

  async updateImgDetails(res, id: string, imgName: string) {
    try {
      const checkMovie = await this.prisma.movie.findFirst({
        where: {
          ma_phim: Number(id),
        }
      })

      if (!checkMovie) {
        errCode(res, id, "Không tìm thấy phim")
        return
      }

      await this.prisma.movie.update({
        data: {
          hinh_anh: imgName
        },
        where: {
          ma_phim: Number(id)
        }
      })

      successCode(res, imgName, "Update thành công")
    } catch (error) {
      failCode(res, error.message)
    }
  }

  async deleteMovie(res: any, maPhim: string) {
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        ma_phim: Number(maPhim),
      }
    })

    if (!checkMovie) {
      errCode(res, maPhim, "Không tìm thấy phim")
      return
    }

    const checkShowtime = await this.prisma.lichChieu.findFirst({
      where: {
        ma_phim: Number(maPhim)
      }
    })

    if (checkShowtime) {
      errCode(res, checkShowtime, "Phim đã có xuất chiếu")
    } else {
      const checkBanner = await this.prisma.banner.findFirst({
        where: {
          ma_phim: Number(maPhim)
        }
      })

      if (checkBanner) {
        await this.prisma.banner.delete({
          where: {
            ma_banner: checkBanner.ma_banner
          }
        })

        await this.prisma.movie.delete({
          where: {
            ma_phim: Number(maPhim)
          }
        })

        successCode(res, checkMovie, "Xử lý thành công")

      } else {
        await this.prisma.movie.delete({
          where: {
            ma_phim: Number(maPhim)
          }
        })
        successCode(res, checkMovie, "Xử lý thành công")

      }

    }



  }

  // async createChair(res: any) {
  //   for (let i = 0; i < 160; i++) {

  //     if (i >= 34 && i <= 45) {
  //       await this.prisma.ghe.create({
  //         data: {
  //           ten_ghe: String(i + 1),
  //           loai_ghe: "Vip",
  //           ma_rap: 9,
  //           da_dat: false,
  //         }
  //       })
  //     } else if (i >= 50 && i <= 61) {
  //       await this.prisma.ghe.create({
  //         data: {
  //           ten_ghe: String(i + 1),
  //           loai_ghe: "Vip",
  //           ma_rap: 9,
  //           da_dat: false,
  //         }
  //       })
  //     } else if (i >= 66 && i <= 77) {
  //       await this.prisma.ghe.create({
  //         data: {
  //           ten_ghe: String(i + 1),
  //           loai_ghe: "Vip",
  //           ma_rap: 9,
  //           da_dat: false,
  //         }
  //       })
  //     } else if (i >= 82 && i <= 93) {
  //       await this.prisma.ghe.create({
  //         data: {
  //           ten_ghe: String(i + 1),
  //           loai_ghe: "Vip",
  //           ma_rap: 9,
  //           da_dat: false,
  //         }
  //       })
  //     } else if (i >= 98 && i <= 109) {
  //       await this.prisma.ghe.create({
  //         data: {
  //           ten_ghe: String(i + 1),
  //           loai_ghe: "Vip",
  //           ma_rap: 9,
  //           da_dat: false,
  //         }
  //       })
  //     } else if (i >= 114 && i <= 125) {
  //       await this.prisma.ghe.create({
  //         data: {
  //           ten_ghe: String(i + 1),
  //           loai_ghe: "Vip",
  //           ma_rap: 9,
  //           da_dat: false,
  //         }
  //       })
  //     } else {
  //       await this.prisma.ghe.create({
  //         data: {
  //           ten_ghe: String(i + 1),
  //           loai_ghe: "Thường",
  //           ma_rap: 9,
  //           da_dat: false,
  //         }
  //       })
  //     }

  //   }

  //   res.send("thanh cong")
  // }

}

