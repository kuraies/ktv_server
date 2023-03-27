/**
推荐管理组件
*/
<template>
  <div class="managemusic">
    <!-- 音乐播放器 -->
    <audio ref="musicPlayer" :src="listenMusicSrc" autoplay></audio>

    <!-- 头部 -->
    <Row style="padding:20px 60px 20px 40px;">
      <!-- 搜索框 -->
      <Col span="5">
        <Input v-model="searchName" clearable placeholder="请输入歌手 歌曲 搜索，按下Enter开始搜索"
               prefix="ios-musical-notes"
               style="width:auto;" @keypress.enter.native="searchSong"/>
      </Col>
      <!-- 试听歌曲按钮，点击这个按钮，显示所有歌曲的模态框 -->
      <Col span="7">
        <Button style="margin-left:0px;" type="primary" @click="toListen = true">试听歌曲</Button>
      </Col>
      <!-- 试听歌曲按钮，点击这个按钮，显示所有歌曲的模态框 -->
      <!-- 歌曲控制是否播放以及添加按钮 -->
      <Col span="12" style="text-align:right;">
        <!-- 控制歌曲的播放以及歌曲播放时候的动画 -->
        <Avatar
            v-if="listenMusicPoster"
            :src="listenMusicPoster"
            :style="{'animation-play-state':animationPlayState}"
            class="listen-poster"
            size="large"
            style="margin-right:40px;"
            @click.native="operateMusic"
        />
        <!--添加 按钮 -->
        <Button type="primary" @click="showAddSongBtn()">添加</Button>
      </Col>
    </Row>

    <!-- 歌曲数据表 el-table-->
    <div style="width: 100%;background-color: #f40;">
      <el-table :data="allSongs" border style="width: 100%">
        <el-table-column align="center" label="序号" type="index" width="60">
        </el-table-column>
        <el-table-column align="center" label="歌曲ID" prop="_id" width="240">
        </el-table-column>
        <el-table-column align="center" label="歌曲名称" prop="songName" width="200">
        </el-table-column>
        <el-table-column align="center" label="歌手名称" prop="artist" width="170">
        </el-table-column>
        <el-table-column align="center" label="歌曲地址" prop="src" width="230">
        </el-table-column>
        <el-table-column align="center" label="歌曲封面" width="200">
          <template slot-scope="scope">
            <Avatar :src="'http://localhost:3000/api/admin/poster?img=' + scope.row.poster" size="large"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="语种" prop="language" width="120">
        </el-table-column>
        <el-table-column align="center" label="歌曲风格" prop="style" width="120">
        </el-table-column>
        <el-table-column align="center" label="点播次数" prop="playCount" width="80">
        </el-table-column>
        <el-table-column align="center" label="更新时间" prop="date" width="200">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <!-- 删除 -->
            <el-button circle icon="el-icon-delete" size="small" type="danger"
                       @click="onDeleteSong(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <Row>
      <Col span="24" style="text-align: right;padding:0 10px;">
        <el-pagination :current-page.sync="paginations.pageIndex" :layout="paginations.layout"
                       :page-size="paginations.pageSize" :page-sizes="paginations.pageSizes"
                       :total="paginations.total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </Col>
    </Row>


    <!-- 添加歌曲对话框 -->
    <el-drawer
        :direction="direction"
        :visible.sync="drawer"
        title="添加推荐歌曲"
    >

      <el-table
          ref="multipleTable"
          :data="allSongs2"
          style="width: 100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            label="歌曲名称"
            prop="songName"
            width="200">
        </el-table-column>
        <el-table-column
            label="歌手名称"
            prop="artist"
            width="200">
        </el-table-column>
        <el-table-column align="center" label="歌曲封面">
          <template slot-scope="scope">
            <Avatar :src="'http://localhost:3000/api/admin/poster?img=' + scope.row.poster" size="large"/>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
            :current-page.sync="paginations2.pageIndex"
            :layout="paginations2.layout"
            :page-size="paginations2.pageSize" :page-sizes="paginations2.pageSizes"
            :total="paginations2.total" style="width:100%" @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2">
        </el-pagination>
      </div>
      <el-button size="large" style="float:right;margin: 25px 50px 50px;" type="primary" @click="addLike()">确认
      </el-button>
    </el-drawer>

    <!-- 密码验证对话框 -->
    <Modal v-model="isCheckPassword" :mask-closable="false" draggable width="360">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information-circle"></Icon>
        <span>验证密码</span>
      </p>
      <div style="text-align:left;font-size: 14px;">
        <Row>
          <Col span="18">
            <Input v-model="inputPassword" icon="ios-key" placeholder="请输入管理员密码..." type="password"
                   @keyup.enter.native="checkPwd()"/>
          </Col>
          <Col span="6">
            <el-button size="small" type="primary" @click="checkPwd()">验证</el-button>
          </Col>
        </Row>
      </div>
      <div slot="footer"></div>
    </Modal>

    <!-- 音乐试听对话框 -->
    <Modal v-model="toListen" width="700">
      <p slot="header" style="color:#f60;text-align: center;">
        <Icon type="ios-musical-notes"/>
        <span>点击试听</span>
      </p>
      <div>
        <el-table :data="allSongs" height="300" style="width: 100%;">
          <el-table-column align="center" label="歌名" prop="songName" width="200"></el-table-column>
          <el-table-column align="center" label="歌手" prop="artist" width="200"></el-table-column>
          <el-table-column align="center" label="试听" width="200">
            <template slot-scope="scope">
              <span class="toListen-link" @click="listenMusic(scope.row)">播放</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" style="height:30px">
        <Col span="24" style="text-align: right;padding:0px 0px">
          <el-pagination :current-page.sync="paginations.pageIndex" :layout="paginations.layout"
                         :page-size="paginations.pageSize" :page-sizes="paginations.pageSizes"
                         :total="paginations.total" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange">
          </el-pagination>
        </Col>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'adminlikes',
  data() {
    return {
      drawer: false,  //抽屉开关
      direction: 'rtl',  //抽屉方向
      // 试听歌曲
      toListen: false,
      listenMusicSrc: '',
      listenMusicPoster: '',
      animationPlayState: 'running',// 动画的运行状态 running 播放  paused 暂停

      // 验证密码
      isCheckPassword: false,
      inputPassword: '',

      // 展示在页面上的每一页的所有歌曲
      allSongs: [],
      allSongs2: [],

      // 是所有的歌曲，和数据库中的歌曲保持一致
      allTableSongs: [],
      allTableSongs2: [],


      // 搜索关键字
      searchName: '',

      // 分页
      paginations: {
        pageIndex: 1,// 当前位于哪一个页面
        total: 0,//总个数
        pageSize: 5,// 每一页显示多少条
        pageSizes: [5, 10, 15, 20, 25],
        layout: "sizes, prev, pager, next, jumper, total" // 翻页的属性
      },
      paginations2: {
        pageIndex: 1,// 当前位于哪一个页面
        total: 0,//总个数
        pageSize: 5,// 每一页显示多少条
        pageSizes: [5, 10, 15, 20, 25],
        layout: "sizes, prev, pager, next, jumper, total" // 翻页的属性
      },

      // 操作的标记 判断是添加----1、删除---3、编辑---2
      flag: -1,
      delRow: {}

    }
  },
  created() {
    this.getAllSong()
  },
  watch: {
    searchName: function () {
      // 如果searchName为"",那么获取全部的歌曲列表
      if (this.searchName === '') {
        this.getAllSong()
      }
    }
  },
  methods: {

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },

    // 抽屉关闭事件
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //       .then(_ => {
    //         done();
    //       })
    //       .catch(_ => {});
    // },
    // 验证管理员密码
    checkPwd() {
      console.log('checkPwd')
      // 获取输入的密码
      const inputPassword = this.inputPassword.trim()
      if (inputPassword.length > 0) {
        // 把密码验证框给关闭
        this.isCheckPassword = false

        // 把这个密码发到服务端去校验
        this.$axios.post('/api/admin/islegal', {
          password: inputPassword,
          email: this.$store.getters.adminInfo.email
        }).then(res => {
          // 把表单中的数据给发送到服务端
          // 提交添加音乐对话框表单中的数据
          console.log('islegal res=>', res)
          if (res.data == true) {
            if (this.flag == 1) {// 添加
              this.$axios.post('/api/admin/music/add', this.addForm)
                  .then(res => {
                    console.log('add song res=>', res) // res.data=> {status:200,result:'添加成功'}
                    this.$Message.success(res.data.result)

                    // 清空表单中的已填写的内容(重置)
                    // 1、第一种方式
                    // this.addForm.songName = ""
                    // this.addForm.artist = ""

                    // 2、第二种方式：让表单中的所有元素重置
                    this.$nextTick(() => {
                      this.inputPassword = ""
                    })

                    // 3、第三种方式：
                    // this.addForm = this.$options.data().addForm

                    // 获取所有歌曲
                    this.getAllSong()
                  }).catch(err => {
                console.log('add song err=>', err)
                this.$Message.error(err.data.result)
              })
            } else if (this.flag == 3) { // 删除
              this.$axios.post('/api/admin/like/delete', {_id: this.delRow._id})
                  .then(res => {
                    console.log('删除歌曲返回res=>', res.data)
                    // 刷新列表

                    // 清空数据
                    this.inputPassword = ""
                    this.$Message.success('删除成功')
                    this.allSongs = []
                    this.getAllSong()
                  })
            }
          }

        }).catch(err => {
          this.inputPassword = ""
        })
      } else {
        this.isCheckPassword = false
        this.$Modal.warning({
          title: '提示',
          content: '密码不能为空，请输入管理员口令',
          onOk: () => {
            this.isCheckPassword = true
          }
        })
      }
    },
    addLike() {
      let ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item._id)
      })
      console.log(ids)
      this.$axios.post('/api/admin/like/add', {_id: ids})
          .then(res => {
            console.log('删除歌曲返回res=>', res.data)
            // 刷新列表
            // this.allSongs2=""
            this.getAllSong();
            this.$Message.success('收藏成功')
          })
    },

    // 添加歌曲
    showAddSongBtn() {
      // 第一种：先弹出密码验证框，然后在验证输入框中输入密码，验证通过后，this.addDialog.show = true
      // this.isCheckPassword = true

      // 第二种：先弹出添加歌曲的对话框，在提交表单信息之前验证密码，验证通过后，才发送添加的请求
      this.drawer = true
    },


    // 根据歌曲或者歌手名称搜索
    searchSong() {
      this.$axios.post('/api/admin/searchByNameLike', {
        searchName: this.searchName
      }).then(res => {
        this.allTableSongs = res.data.result // 所有的歌曲 12条数

        // 分页
        this.paginations.total = this.allTableSongs.length
        this.paginations.pageIndex = 1
        this.paginations.pageSize = 5

        this.allSongs = this.allTableSongs.filter((item, index) => { // 过滤之后，只剩下5条数据了。
          return index < this.paginations.pageSize
        })
      })
    },

    // 获取所有的歌曲
    getAllSong() {
      this.$axios.get('/api/admin/alllike')
          .then(res => {
            console.log('getAllSong res=>', res)
            this.allTableSongs = res.data.result // 所有的歌曲 12条数

            // 分页
            this.paginations.total = this.allTableSongs.length
            this.paginations.pageIndex = 1
            this.paginations.pageSize = 5

            this.allSongs = this.allTableSongs.filter((item, index) => { // 过滤之后，只剩下5条数据了。
              return index < this.paginations.pageSize
            })

          }).catch(err => {
        this.$Message.error(err)
      });
      this.$axios.get('/api/admin/allmusics')
          .then(res => {
            console.log('getAllSong res=>', res)
            this.allTableSongs2 = res.data.result // 所有的歌曲 12条数

            // 分页
            this.paginations2.total = this.allTableSongs2.length
            this.paginations2.pageIndex = 1
            this.paginations2.pageSize = 5

            this.allSongs2 = this.allTableSongs2.filter((item, index) => { // 过滤之后，只剩下5条数据了。
              return index < this.paginations2.pageSize
            })

          }).catch(err => {
        this.$Message.error(err)
      })
    },
    // 当前页，页码改变
    handleCurrentChange(page) {
      console.log('当前页=>', page)

      // 在前端分页
      // 获取当前页的数量
      // 0~4 5~9 10~11
      let sortNum = this.paginations.pageSize * (page - 1) // 5
      const tableData = this.allTableSongs.filter((item, index) => {
        return index >= sortNum
      })
      console.log('tableData=>', tableData)
      // this.allSongs = tableData.filter((item,index)=>{
      //     return index < this.paginations.pageSize
      // })

      this.allSongs = tableData.slice(0, 5)
    },
    handleCurrentChange2(page) {
      console.log('当前页=>', page)

      // 在前端分页
      // 获取当前页的数量
      // 0~4 5~9 10~11
      let sortNum = this.paginations2.pageSize * (page - 1) // 5
      const tableData = this.allTableSongs2.filter((item, index) => {
        return index >= sortNum
      })
      console.log('tableData=>', tableData)
      // this.allSongs = tableData.filter((item,index)=>{
      //     return index < this.paginations.pageSize
      // })

      this.allSongs2 = tableData.slice(0, 5)
    },
    // 改变每页条数
    handleSizeChange(pageSize) {
      console.log('每一页个数=>', pageSize)
      this.paginations.pageIndex = 1
      this.paginations.pageSize = pageSize

      this.allSongs = this.allTableSongs.slice(0, pageSize)
    },
    handleSizeChange2(pageSize) {
      console.log('每一页个数=>', pageSize)
      this.paginations2.pageIndex = 1
      this.paginations2.pageSize = pageSize

      this.allSongs2 = this.allTableSongs2.slice(0, pageSize)
    },
    // 收藏歌曲
    likeSongs(song) {
      console.log('收藏歌曲song=>', song)
    },


    // // 删除歌曲
    onDeleteSong(song) {
      console.log('删除歌曲song=>', song)
      // 弹框提示是否删除
      this.$confirm(`确定删除${song.songName}(${song.artist})歌曲吗？不可撤销的，是否继续?`,
          "风险提示",
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(() => {
        this.isCheckPassword = true
        this.flag = 3
        this.delRow = song
        console.log('删除的歌曲=>', this.delRow)
      }).catch(err => {
        // 点击取消后进入这里执行
        console.log('取消：', err)
      })

      // 验证密码
    },

    // 试听歌曲
    listenMusic(song) {
      console.log('试听歌曲song=>', song)
      this.listenMusicSrc = `http://localhost:3000/api/admin/musicById?id=${song._id}`
      this.listenMusicPoster = 'http://localhost:3000/api/admin/poster?img=' + song.poster
    },
    // 控制音乐的播放和暂停
    operateMusic() {
      // 控制音乐播放和暂停  audio 有个状态paused 为true表示播放器处于停止状态，否则就是播放状态
      // 控制动画的开启和关闭
      if (this.$refs.musicPlayer.paused) {// 暂停的状态
        // 开启播放
        this.$refs.musicPlayer.play()
        // 开启动画
        this.animationPlayState = 'running'
      } else {// 播放的状态
        // 暂停播放
        this.$refs.musicPlayer.pause()
        // 停止动画
        this.animationPlayState = 'paused'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.managemusic {
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 100px;

  .listen-poster {
    cursor: pointer;
    animation: poster 15s linear infinite;
  }

  @keyframes poster {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}

.toListen-link {
  cursor: pointer;

  &:hover {
    color: rgb(223, 107, 72)
  }
}
</style>


















