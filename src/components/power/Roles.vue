<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色按钮区域 -->
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col>
                {{item1.authName}}
              </el-col>
              <!-- 渲染二级，三级权限 -->
              <el-col></el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUseById(scope.row.id)">删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色按钮弹出的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addRoleFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      addRoleDialogVisible: false,
      editDialogVisible: false,
      addRoleForm: {
        // roleName: '',
        // roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名的长度在3~10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '描述的长度在3~10个字符之间', trigger: 'blur' }
        ]
      },
      editForm: {},
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data;
    },
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    addRoleUser() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) retrun;
        const { data: res } = await this.$http.post('roles', this.addRoleForm);
        if (res.meta.status !== 201) {
          return this.$message.error('创建角色失败');
        };
        this.$message.success('创建角色成功');
        this.addRoleDialogVisible = false;
        //重新获取用户列表
        this.getRolesList();
      })
    },
    async showEditDialog(id) {
      //显示用户修改界面
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！');
      }
      this.editForm = res.data;
      console.log(id);
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起添加用户的网络请求
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        });
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败');
        }
        //关闭对话框
        this.editDialogVisible = false;
        this.$message.success('更新角色信息成功');
        //重新获取用户列表
        this.getRolesList();
      });
    },
    async removeUseById(id) {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认删除，则返回字符串 confirm
      //如果用户取消，则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除');
      }
      const { data: res } = await this.$http.delete('roles/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败');
      }
      this.$message.success('删除用户成功');
      this.getRolesList();

    }

  }
}
</script>

<style lang="less" scoped>
</style>
