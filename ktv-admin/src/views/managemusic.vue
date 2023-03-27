/**
    歌曲管理组件
*/
<template>
    <div class="managemusic">
        <!-- 音乐播放器 -->
        <audio :src="listenMusicSrc" autoplay ref="musicPlayer"></audio>

        <!-- 头部 -->
        <Row style="padding:20px 60px 20px 40px;">
            <!-- 搜索框 -->
            <Col span="5">
            <Input v-model="searchName" prefix="ios-musical-notes" clearable style="width:auto;"
                placeholder="请输入歌手 歌曲 搜索，按下Enter开始搜索" @keypress.enter.native="searchSong" />
            </Col>
            <!-- 试听歌曲按钮，点击这个按钮，显示所有歌曲的模态框 -->
            <Col span="7">
            <Button type="primary" style="margin-left:0px;" @click="toListen = true">试听歌曲</Button>
        </Col>
        <!-- 试听歌曲按钮，点击这个按钮，显示所有歌曲的模态框 -->

            <!-- 歌曲控制是否播放以及添加按钮 -->
            <Col span="12" style="text-align:right;">
                <!-- 控制歌曲的播放以及歌曲播放时候的动画 -->
                <Avatar 
                v-if="listenMusicPoster"
                    class="listen-poster"
                    size="large" 
                    style="margin-right:40px;" 
                    :src="listenMusicPoster"
                    @click.native="operateMusic"
                    :style="{'animation-play-state':animationPlayState}"
                />
                <!--添加 按钮 -->
                <Button type="primary" @click="showAddSongBtn()">添加</Button>
            </Col>
        </Row>

        <!-- 歌曲数据表 el-table-->
        <div style="width: 100%;background-color: #f40;">
            <el-table :data="allSongs" border style="width: 100%">
                <el-table-column type="index" label="序号" align="center" width="60">
                </el-table-column>
                <el-table-column prop="_id" label="歌曲ID" align="center" width="240">
                </el-table-column>
                <el-table-column prop="songName" label="歌曲名称" align="center" width="200">
                </el-table-column>
                <el-table-column prop="artist" label="歌手名称" align="center" width="170">
                </el-table-column>
                <el-table-column prop="src" label="歌曲地址" align="center" width="230">
                </el-table-column>
                <el-table-column label="歌曲封面" align="center" width="200">
                    <template slot-scope="scope">
                        <Avatar :src="'http://localhost:3000/api/admin/poster?img=' + scope.row.poster" size="large" />
                    </template>
                </el-table-column>
                <el-table-column prop="language" label="语种" align="center" width="120">
                </el-table-column>
                <el-table-column prop="style" label="歌曲风格" align="center" width="120">
                </el-table-column>
                <el-table-column prop="playCount" label="点播次数" align="center" width="80">
                </el-table-column>
                <el-table-column prop="date" label="更新时间" align="center" width="200">
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- 收藏 -->
                        <el-button type="warning" size="small" circle icon="el-icon-star-off"
                            @click="likeSongs(scope.row)"></el-button>
                        <!-- 编辑 -->
                        <el-button type="primary" size="small" circle icon="el-icon-edit"
                            @click="onEditSong(scope.row)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" size="small" circle icon="el-icon-delete"
                            @click="onDeleteSong(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <Row>
            <Col span="24" style="text-align: right;padding:0 10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="paginations.pageIndex" :page-sizes="paginations.pageSizes"
                :page-size="paginations.pageSize" :layout="paginations.layout" :total="paginations.total">
            </el-pagination>
            </Col>
        </Row>


        <!-- 添加歌曲对话框 -->
        <el-dialog :title="addDialog.title" :visible.sync="addDialog.show" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form ref="addForm" :model="addForm" :rules="addForm_rules" label-width="120px" style="margin:10px;">
                <el-form-item label="歌曲名称" prop="songName">
                    <el-input v-model="addForm.songName"></el-input>
                </el-form-item>
                <el-form-item label="歌手名称" prop="artist">
                    <el-input v-model="addForm.artist"></el-input>
                </el-form-item>
                <el-form-item label="歌曲地址" prop="src">
                    <Upload action="http://localhost:3000/api/admin/upload/music" :on-success="handleAddSongSuccess"
                            :format="['mp3','ogg']">
                      <Button icon="ios-cloud-upload-outline">上传歌曲</Button>
                    </Upload>
                </el-form-item>
                <el-form-item label="歌曲封面" prop="poster">
                <Upload action="http://localhost:3000/api/admin/upload/poster" :on-success="handleAddPosterSuccess"
                    :format="['jpg', 'png']" :max-size="10000" multiple :show-upload-list="false">

                        <Avatar :src="addFormPosterSrc" size="large" />
                    </Upload>
                </el-form-item>
            <el-form-item label="语种" prop="language">


                    <Select placeholder="请选择语种" v-model="addForm.language" clearable>
                        <Option v-for="item in languages" :value="item" :key="item">{{ item }}</Option>
                    </Select>
            </el-form-item>
            <el-form-item label="风格" prop="style">

                    <Select placeholder="请选择歌曲风格" v-model="addForm.style" clearable>
                        <Option v-for="item in songStyles" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addDialog.show = false">取消</el-button>
                    <el-button @click="addSong('addForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 编辑歌曲对话框 -->
        <el-dialog :title="editDialog.title" :visible.sync="editDialog.show" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form ref="editForm" :model="editForm" :rules="addForm_rules" label-width="120px" style="margin:10px;">
                <el-form-item label="歌曲名称" prop="songName">
                    <el-input v-model="editForm.songName"></el-input>
                </el-form-item>
                <el-form-item label="歌手名称" prop="artist">
                    <el-input v-model="editForm.artist"></el-input>
                </el-form-item>
                <el-form-item label="歌曲地址" prop="src">
                    <Upload action="http://localhost:3000/api/admin/upload/music" :on-success="handleEditSongSuccess"
                        :format="['mp3']">
                        <Button icon="ios-cloud-upload-outline">上传歌曲</Button>
                    </Upload>
                </el-form-item>
                <el-form-item label="歌曲封面" prop="poster">
                    <Upload action="http://localhost:3000/api/admin/upload/poster" :on-success="handleEditPosterSuccess"
                        :format="['jpg', 'png']" :max-size="10000" multiple :show-upload-list="false">
                        <Avatar :src="editFormPosterSrc" size="large" />
                    </Upload>
                </el-form-item>
                <el-form-item label="语种" prop="language">
                    <Select placeholder="请选择语种" v-model="editForm.language" clearable>
                        <Option v-for="item in languages" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </el-form-item>
                <el-form-item label="风格" prop="style">
                    <Select placeholder="请选择歌曲风格" v-model="editForm.style" clearable>
                        <Option v-for="item in songStyles" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="editDialog.show = false">取消</el-button>
                    <el-button @click="editSong('editForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 密码验证对话框 -->
        <Modal width="360" draggable v-model="isCheckPassword" :mask-closable="false">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>验证密码</span>
            </p>
            <div style="text-align:left;font-size: 14px;">
                <Row>
                    <Col span="18">
                    <Input type="password" icon="ios-key" placeholder="请输入管理员密码..." v-model="inputPassword"
                        @keyup.enter.native="checkPwd()" />
                    </Col>
                    <Col span="6">
                    <BUtton type="primary" size="large" @click="checkPwd()">验证</BUtton>
                    </Col>
                </Row>
            </div>
            <div slot="footer"></div>
        </Modal>

        <!-- 音乐试听对话框 -->
        <Modal width="700" v-model="toListen">
            <p slot="header" style="color:#f60;text-align: center;">
                <Icon type="ios-musical-notes" />
                <span>点击试听</span>
            </p>
            <div style="100%">
                <el-table :data="allSongs" height="300" style="width: 100%;">
                    <el-table-column prop="songName" align="center" width="200" label="歌名"></el-table-column>
                    <el-table-column prop="artist" align="center" width="200" label="歌手"></el-table-column>
                    <el-table-column align="center" width="200" label="试听">
                        <template slot-scope="scope">
                            <span class="toListen-link" @click="listenMusic(scope.row)">播放</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" style="height:30px">
                <Col span="24" style="text-align: right;padding:0px 0px">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="paginations.pageIndex" :page-sizes="paginations.pageSizes"
                    :page-size="paginations.pageSize" :layout="paginations.layout" :total="paginations.total">
                </el-pagination>
                </Col>
            </div>
        </Modal>
    </div>
</template>

<script>
import musicImg from '../assets/image/music.jpg'

export default {
    name: 'managemusic',
    data() {
        return {
            // 试听歌曲
            toListen: false,
            listenMusicSrc: '',
            listenMusicPoster:'',
            animationPlayState:'running',// 动画的运行状态 running 播放  paused 暂停

            // 验证密码
            isCheckPassword: false,
            inputPassword: '',

            // 添加歌曲
            addDialog: {
                title: '添加歌曲',
                show: false
            },
            addForm: {
              songName: '',//歌曲名称
              artist: '',// 歌手名称
              src: '',// 歌曲地址
              poster: '',// 歌曲封面地址
              language: '',// 歌曲语种
              style: '',// 歌曲分类
              md5: '',//歌曲md5
            },
            addFormPosterSrc: musicImg,
            editFormPosterSrc: musicImg,
            addForm_rules: {
                songName: [{ required: true, message: '歌曲名称不能为空' }],
                artist: [{ required: true, message: '歌手名称不能为空' }],
                src: [{ required: true, message: '歌曲不能为空' }],
                poster: [{ required: true, message: '歌曲封面不能为空' }]
            },

            // 编辑歌曲
            editDialog: {
                title: '编辑歌曲',
                show: false
            },
            editForm: {
              _id: "",
              songName: '',//歌曲名称
              artist: '',// 歌手名称
              src: '',// 歌曲地址
              poster: '',// 歌曲封面地址
              language: '',// 歌曲语种
              style: '',// 歌曲分类
              md5: '',//歌曲md5
            },

            // 语种
            languages: ['汉语', "韩语", "日语", "英语", "粤语"],

            // 风格
            songStyles: ['流行', "网络", "传统", "民歌", "摇滚", "伴奏", "古风"],

            // 展示在页面上的每一页的所有歌曲
            allSongs: [],
            // 是所有的歌曲，和数据库中的歌曲保持一致
            allTableSongs: [],

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
                                        this.$refs.addForm.resetFields()
                                    })

                                    // 3、第三种方式：
                                    // this.addForm = this.$options.data().addForm

                                    // 获取所有歌曲
                                    this.getAllSong()
                                }).catch(err => {
                                    console.log('add song err=>', err)
                                    this.$Message.error(err.data.result)
                                })
                        } else if (this.flag == 2) {//编辑
                    this.$axios.post('/api/admin/music/edit', this.editForm)
                                .then(res => {
                                    console.log('编辑歌曲res=>', res)
                                    this.getAllSong()
                                    this.inputPassword = ''
                                    this.$Message.success('更新成功')
                                })
                        } else if (this.flag == 3) { // 删除
                    this.$axios.post('/api/admin/music/delete', {_id: this.delRow._id})
                        .then(res => {
                          console.log('删除歌曲返回res=>', res.data)
                          // 刷新列表
                          this.getAllSong()

                          // 清空数据
                          this.inputPassword = ""
                          this.$Message.success('删除成功')
                        })
                  } else if (this.flag == 4) { // 收藏
                    this.$axios.post('/api/admin/like/add', {_id: this.delRow._id})
                        .then(res => {
                          console.log('删除歌曲返回res=>', res.data)
                          // 刷新列表

                          // 清空数据
                          this.inputPassword = ""
                          this.$Message.success('收藏成功')
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

        // 添加歌曲
        showAddSongBtn() {
            // 第一种：先弹出密码验证框，然后在验证输入框中输入密码，验证通过后，this.addDialog.show = true
            // this.isCheckPassword = true

            // 第二种：先弹出添加歌曲的对话框，在提交表单信息之前验证密码，验证通过后，才发送添加的请求
            this.addDialog.show = true
        },

        // 提交添加歌曲的表单内容
        addSong(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 弹出验证密码的modal，同时关闭表单对话框
                    this.isCheckPassword = true
                    this.addDialog.show = false

                    // 设置操作标记为1
                    this.flag = 1

                } else {
                    // todo 例如：弹出提示框  Message
                }
            })
        },

        // 编辑歌曲的表单内容
        editSong(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.isCheckPassword = true
                    this.editDialog.show = false
                    this.flag = 2
                } else {
                    // todo 例如：弹出提示框  Message
                }
            })
        },

        // 上传歌曲成功之后的回调函数
        handleAddSongSuccess(res) {
          console.log('添加歌曲回调res=>', res)
          this.addForm.src = res.result.src
          this.addForm.AudioMD5 = res.result.AudioMD5
        },

        // 编辑的时候上传歌曲成功之后的回调函数
        handleEditSongSuccess(res) {
          this.editForm.src = res.result.src
          this.editForm.AudioMD5 = res.result.AudioMD5
        },

        // 上传海报封面成功之后的回调函数
        handleAddPosterSuccess(res) {
            console.log('添加海报回调res=>', res)
            this.addForm.poster = res.result.poster
            this.addFormPosterSrc = 'http://localhost:3000/api/admin/poster?img=' + res.result.poster
        },

        // 编辑的时候上传海报封面成功之后的回调函数
        handleEditPosterSuccess(res) {
            this.editForm.poster = res.result.poster
            this.editFormPosterSrc = 'http://localhost:3000/api/admin/poster?img=' + res.result.poster
        },

        // 根据歌曲或者歌手名称搜索
        searchSong() {
          this.$axios.post('/api/admin/searchByName', {
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
          this.$axios.get('/api/admin/allmusics')
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
        // 改变每页条数
        handleSizeChange(pageSize) {
            console.log('每一页个数=>', pageSize)
            this.paginations.pageIndex = 1
            this.paginations.pageSize = pageSize

            this.allSongs = this.allTableSongs.slice(0, pageSize)
        },

        // 收藏歌曲
        likeSongs(song) {
          console.log("收藏")
          this.isCheckPassword = true
          this.flag = 4;
          this.delRow = song
        },

        // 编辑歌曲
        onEditSong(song) {
            console.log('编辑歌曲song=>', song)
            this.editForm = { ...song }
            this.editFormPosterSrc = 'http://localhost:3000/api/admin/poster?img=' + song.poster
            this.editDialog.show = true
        },

        // 删除歌曲
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
        operateMusic(){
            // 控制音乐播放和暂停  audio 有个状态paused 为true表示播放器处于停止状态，否则就是播放状态
            // 控制动画的开启和关闭
            if(this.$refs.musicPlayer.paused){// 暂停的状态
                // 开启播放
                this.$refs.musicPlayer.play()
                // 开启动画
                this.animationPlayState = 'running'
            }else{// 播放的状态
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
    .listen-poster{
        cursor: pointer;
        animation:poster 15s linear infinite;
    }

    @keyframes poster{
        from{
            transform: rotate(0deg);
        }
        to{
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


















