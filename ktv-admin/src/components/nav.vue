<template>
    <div class="wsmnav">
        <el-row type="flex" justify="space-between">
            <!-- 标题 -->
            <el-col :span="14">
                <span class="nav-logo">音乐管理系统</span>
            </el-col>
            <!-- 时钟 -->
            <el-col :span="4">
                <p class="current-time">2023-03-02 19:32:50</p>
            </el-col>
            <!-- 下拉列表 -->
            <el-col :span="6">
                <div class="avatar_container">
                    <Dropdown>
                        <a href="javascript:void(0)">
                            <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                            <Icon type="ios-arrow-down" style="margin-left:5px;color:#bbb;"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem>个人中心(待开发)</DropdownItem>
                            <DropdownItem @click.native="logout">退出登录</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <span class="user_email">你好，{{ adminInfo.username }}</span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>


<script>
export default {
    name: 'wsmnav',
    data() {
        return {
            adminInfo: {}
        }
    },
    created() {
        this.getAdminInfo()
    },
    methods: {
        // 获取管理员信息
        getAdminInfo() {
            this.adminInfo = this.$store.getters.adminInfo
            console.log('nav this.adminInfo=>', this.adminInfo)
        },
        logout() {
            // 询问用户，增强体验
            this.$confirm('确定退出吗?', '退出提示', {
                confirmButtonText: '退出',
                cancelButtonText: '取消'
            }).then(() => {
                // token给清空
                localStorage.removeItem('adminToken')
                // 跳转到登录页面
                this.$router.push('/login')
            })


        }
    }
}
</script>

<style lang="less" scoped>
.wsmnav {
    height: 60px;
    background-color: #fff;

    // logo字样的样式
    .nav-logo {
        height: 60px;
        line-height: 60px;
        color: rgb(192, 190, 190);
        font-size: 40px;
        width: 100%;
        text-align: center;
        font-family: "隶书";
    }

    .current-time {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        color: rgb(173, 166, 166);
        text-align: left;
    }

    .avatar_container {
        height: 100%;

        display: flex;
        flex-direction: row;
        align-items: center;

        color: rgb(173, 166, 166);

        .user_email {
            margin-left: 10px;
        }
    }
}
</style>
