# class DocumentRetrieveView(RetrieveUpdateDestroyAPIView):

#     def get_queryset(self):
#         document_type = self.request.query_params.get('type')
#         if document_type 
#             self.serializer_class = ArticleDetailSerializer
#             return Article.objects.select_related('featured_image', 'file').prefetch_related('tags').all()
#         elif document_type 
#             self.serializer_class = VideoSerializer
#             return Video.objects.select_related('featured_image', 'file').prefetch_related('tags').all()
#         elif document_type 
#             self.serializer_class = LabworkDetailSerializer
#             return Labwork.objects.select_related('featured_image', 'file').prefetch_related('tags').all()
#         else:
#             return Document.objects.all()

#     def get_serializer_class(self):
#         document_type = self.request.query_params.get('type')
#         if document_type 
#             return ArticleSerializer
#         elif document_type 
#             return VideoSerializer
#         elif document_type 
#             return LabworkDetailSerializer
#         else:
#             return DocumentSerializer