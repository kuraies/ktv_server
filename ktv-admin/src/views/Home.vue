<template>
    <div class="home">
        <!-- 导航栏 -->
        <div class="nav">
            <wsmnav></wsmnav>
        </div>
        <!-- 版心 -->
        <div class="home_content">
            <!-- 菜单 -->
            <div class="menu">
                <el-menu :default-active="defaultActiveMenu" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
                    <el-menu-item index="/admin/welcome">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/managemusic">
                        <i class="el-icon-s-operation"></i>
                        <span slot="title">歌曲管理</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/musiclikes">
                        <i class="el-icon-share"></i>
                        <span slot="title">推荐歌曲</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/userservice">
                        <i class="el-icon-user-solid"></i>
                        <span slot="title">开机服务</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/allorders">
                        <i class="el-icon-s-order"></i>
                        <span slot="title">订单查询</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <!-- 内容区域 -->
            <div class="content">
                <router-view></router-view>
            </div>
        </div>

    </div>
</template>

<script>
import wsmnav from '@/components/nav.vue'
export default {
    name: 'home',
    data:function(){
        return {
            
        }
    },
    components: {
        wsmnav
    },
    computed:{
        defaultActiveMenu(){
            return this.$route.path
        }
    }

}
</script>

<style lang="less" scoped>
.home {
    
    .nav {
        width: 100%;
        border-bottom: 1px solid rgb(173, 166, 166);
    }

    .home_content {
        display: flex;
        .menu {
            width: 192px;
            height: 100vh;
            .el-menu{
                height: 100%;
            }
        }

        .content {
            width:calc(100% - 192px);
            padding-left: 10px;
            padding-right: 20px;
        }
    }
}
</style>